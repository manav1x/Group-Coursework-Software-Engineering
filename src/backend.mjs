
import express from "express";  // Importing the express package
import mysql from "mysql2/promise";  // Importing the mysql2/promise package for MySQL database connection and interaction
import bcrypt from "bcryptjs";  // Importing the bcryptjs package for password hashing and comparison
import DatabaseService from "./services/database_services.mjs";  // Importing a custom module for database interaction
import session from "express-session";  // Importing the express-session package for session management

// Creating an instance of the express application
const app = express();

// Setting the port for the server to listen on
const port = 4000;

// Using the middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Using the express-session middleware to manage sessions
app.use(
  session({
    secret: "verysecretkey",  // A secret key used to sign the session ID cookie
    resave: false,  // Whether to save the session data on every request
    saveUninitialized: true,  // Whether to save uninitialized session data
    cookie: { secure: false },  // Options for the session ID cookie
  })
);

// Creating a MySQL database connection
const db = await mysql.createConnection({ 
    host: process.env.DATABASE_HOST || "localhost",
    user: "user",
    password: "password",
    database: "world",
});

// Setting the view engine to pug
app.set("view engine", "pug");

// Serving static files from the 'static' directory
app.use(express.static("static"));

// Logging the value of the NODE_ENV environment variable
console.log(process.env.NODE_ENV);

// Handling GET requests to the root URL by rendering the 'landing-page' template
app.get('/', (req, res) => {
    res.render("landing-page");
});
app.get('/Meet-Our-Team', (req, res) => {
  res.render("Meet-Our-Team");
});

// Handling GET requests to the '/register' URL by rendering the 'register' template
app.get('/register', function(req,res){
    res.render('register');
});

// Handling GET requests to the '/subscription-plans' URL by rendering the 'subscription-plans' template
app.get('/subscription-plans', function(req,res){
    res.render('subscription-plans');
});

// Handling GET requests to the '/login' URL by rendering the 'login' template
app.get('/login', function(req,res){
    res.render('login');
});

// Handling GET requests to the '/layout' URL by rendering the 'layout' template
app.get('/layout', function(req,res){
    res.render('layout');
});

// Handling GET requests to the '/cities' URL by querying the 'city' table in the database and rendering the 'cities' template with the retrieved data
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
      return res.render("cities", {rows, fields, search});
  } catch (err) {
      console.error(err);
      return res.send("Internal Server Error");
  }
});

// Handling GET requests to the '/country' URL by querying the 'country' table in the database and rendering the 'country' template with the retrieved data

 


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
// Handling GET requests to the '/language' URL by querying the 'language' table in the database and rendering the 'country' template with the retrieved data

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

//making account using credentials
app.post("/makeaccount", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const sql = `INSERT INTO user (email, password) VALUES ('${email}', '${hashed}')`;
    const [result, _] = await db.execute(sql);
    const id = result.insertId;
    req.session.auth = true;
    req.session.userId = id;
    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res.status(400).send(err.sqlMessage);
  }
});


//using function authenticate to login using hashed details
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