//Import all the modules
import express from "express";
import mysql from "mysql2/promise";

//Create an instance for express and set port to 4000
const app = express();
const port = 4000;

app.use(express.urlencoded({extended: true}));

//Set the view engine to pug
app.set("view engine", "pug");

//Use the static files form static dictionary
app.use(express.static("static"));

//Print the value of the NODE_ENV
console.log(process.env.NODE_ENV);


//Handle request to the root URL
app.get("/", (res,req) =>{
    res.render("index");
});

app.get('/register', function(res,req){
    res.render('register');

});

app.get('/login', function(res,req){
    res.render('login');
});

//create a MYSQL database coonnection
const db = await mysql.createConnection({ 
    host: process.env.DATABASE_HOST || "localhost",
    user: "user",
    password: "password",
    database: "world",
});



//Handle request to the cities URL
app.get("/cities/:id", async (req, res) => { 
    try{
        const [rows, fields] = await db.execute("SELECT * FROM `city`");
        console.log(`/cities: ${rows.length} rows`);
        return res.render("cities", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.send("Internal Server Error"); 
    }

});

//Handle request to the country URL
app.get("/country/:id", async (req, res) => { 
    try {
        const [rows, fields] = await db.execute("SELECT * FROM `country`"); 
        console.log(`/country: ${rows.length} rows`);
        return res.render("country", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.send("Internal Server Error"); 
    }
});


//Handle request to the language URL
app.get("/language/:id", async (req, res) => { 
    try {
        const [rows, fields] = await db.execute("SELECT * FROM `countrylanguage`"); 
        console.log(`/language: ${rows.length} rows`);
        return res.render("language", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.send("Internal Server Error"); 
    }
});

app.post('/cities/:id', async (req, res) => {
    const cityId  = req.params.id;
    const { name } = req.body;
    const sql = `
        UPDATE city
        SET Name = '${name}'
        WHERE ID = '${cityId}';
    `
    await Connection.execute(sql);
    return res.redirect(`/cities/${cityId}`)
});

//Start the Express application and listen for incoming requests
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
