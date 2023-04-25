import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import DatabaseService from "./services/database_services.mjs";
import session from "express-session";


const app = express();
const port = 4000;
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "verysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//app.use(express.urlencoded({extended: true}));
//create a MYSQL database coonnection
const db = await mysql.createConnection({ 
    host: process.env.DATABASE_HOST || "localhost",
    user: "user",
    password: "password",
    database: "world",
});
//Set the view engine to pug
app.set("view engine", "pug");

app.use(express.static("static"));

console.log(process.env.NODE_ENV);

app.get('/', (req, res) => {
    res.render("landing-page");
});

app.get('/register', function(req,res){
    res.render('register');
});
app.get('/subscription-plans', function(req,res){
    res.render('subscription-plans');
});

app.get('/login', function(req,res){
    res.render('login');
});

app.get('/layout', function(req,res){
    res.render('layout');
});

app.get("/cities", async (req, res) => { 
  try {
      const search = req.query.q || "";
      let populated = req.query.max;
      let sortOrder = "ID ASC";
      const sortParam = req.query.sort;
      if (sortParam === "population_asc") {
        sortOrder = "Population ASC";
      } else if (sortParam === "population_desc") {
        sortOrder = "Population DESC";
      } 
      const [rows, fields] = await db.execute(`SELECT * FROM city WHERE name LIKE '%${search}%' ORDER BY ${sortOrder}`);
      //console.log(`/cities: ${rows.length} rows`);
      return res.render("cities", {rows, fields, search});
  } catch (err) {
      console.error(err);
      return res.send("Internal Server Error");
  }
});




app.get("/country", async (req, res) => { 
  try {
      const search = req.query.q || "";
      let sortOrder = "Code ASC";
      const sortParam = req.query.sort;
      if (sortParam === "population_asc") {
        sortOrder = "Population ASC";
      } else if (sortParam === "population_desc") {
        sortOrder = "Population DESC";
      } 
      const [rows, fields] = await db.execute(`SELECT * FROM country WHERE name LIKE '%${search}%' ORDER BY ${sortOrder}`);
      //console.log(`/country: ${rows.length} rows`);
      return res.render("country", {rows, fields, search});
  } catch (err) {
      console.error(err);
      return res.send("Internal Server Error"); 
  }
});



app.get("/language", async (req, res) => { 
  try {
    const search = req.query.q || "";
    let sortOrder = "CountryCode ASC";
    const sortParam = req.query.sort;
    if (sortParam === "percentage_asc") {
      sortOrder = "Percentage ASC";
    } else if (sortParam === "percentage_desc") {
      sortOrder = "Percentage DESC";
    } 
    const [rows, fields] = await db.execute(`SELECT * FROM countrylanguage WHERE language LIKE '%${search}%' ORDER BY ${sortOrder}`);
    //console.log(`/language: ${rows.length} rows`);
    return res.render("language", {rows, fields, search});
  } catch (err) {
    console.error(err);
    return res.send("Internal Server Error"); 
  }
});


app.post("/makeaccount", async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
      const sql = `INSERT INTO user (email, password) VALUES ('${email}', '${hashed}')`;
      const [result, _] = await conn.execute(sql);
      const id = result.insertId;
      req.session.auth = true;
      req.session.userId = id;
      return res.redirect("/login");
    } catch (err) {
      console.error(err);
      return res.status(400).send(err.sqlMessage);
    }
  });


app.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(401).send("Missing credentials");
    }
  
    const sql = `SELECT id, password FROM user WHERE email = '${email}'`;
    const [results, cols] = await db.execute(sql);
  
    const user = results[0];
  
    if (!user) {
      return res.status(401).send("User does not exist");
    }
  
    const { id } = user;
    const hash = user?.password;
    const match = await bcrypt.compare(password, hash);
  
    if (!match) {
      return res.status(401).send("Invalid password");
    }
  
    req.session.auth = true;
    req.session.userId = id;
  
    return res.redirect("/layout");
  });


app.get("/account", async (req, res) => {
  const { auth, userId } = req.session;

  if (!auth) {
    return res.redirect("/login");
  }

  const sql = `SELECT id, email FROM user WHERE user.id = ${userId}`;
  const [results, cols] = await db.execute(sql);
  const user = results[0];

  res.render("account", { user });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});