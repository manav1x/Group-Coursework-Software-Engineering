//Import all the modules
import express from "express";
import mysql from "mysql2/promise";

//Create an instance for express and set port to 4000
const app = express();
const port = 4000;

//Set the view engine to pug
app.set("view engine", "pug");

//Use the static files form static dictionary
app.use(express.static("static"));

//Print the value of the NODE_ENV
console.log(process.env.NODE_ENV);


//Handle request to the root URL
app.get('/', (req, res) => {
    res.render("index");
});

//create a MYSQL database coonnection
const db = await mysql.createConnection({ 
    host: process.env.DATABASE_HOST || "localhost",
    user: "user",
    password: "password",
    database: "world",
});


app.get("/ping", (req, res) => {
    res.send("pong");
});

//Handle request to the cities URL
app.get("/cities", async (req, res) => { 
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
app.get("/country", async (req, res) => { 
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
app.get("/language", async (req, res) => { 
    try {
        const [rows, fields] = await db.execute("SELECT * FROM `countrylanguage`"); 
        console.log(`/language: ${rows.length} rows`);
        return res.render("language", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.send("Internal Server Error"); 
    }
});

//Start the Express application and listen for incoming requests
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
