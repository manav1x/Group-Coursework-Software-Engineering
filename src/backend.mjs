const express = require("express");
const mysql = require("mysql2/promise"); // Change import to promise version

const app = express();
const port = 4000;

app.set("view engine", "pug");

app.use(express.static("static"));

console.log(process.env.NODE_ENV);

app.get('/', (req, res) => {
    res.render("index");
});

const db = mysql.createConnection({ // Change createConnection to createPool
    host: process.env.DATABASE_HOST || "localhost",
    user: "user",
    password: "password",
    database: "world",
});

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/cities", async (req, res) => { // Add async keyword to route handler
    try {
        const [rows, fields] = await db.execute("SELECT * FROM `city`"); // Use await and destructuring assignment
        console.log(`/cities: ${rows.length} rows`);
        return res.render("cities", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error"); // Return error response
    }
});

app.get("/country", async (req, res) => { // Add async keyword to route handler
    try {
        const [rows, fields] = await db.execute("SELECT * FROM `country`"); // Use await and destructuring assignment
        console.log(`/country: ${rows.length} rows`);
        return res.render("country", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error"); // Return error response
    }
});

app.get("/language", async (req, res) => { // Add async keyword to route handler
    try {
        const [rows, fields] = await db.execute("SELECT * FROM `countrylanguage`"); // Use await and destructuring assignment
        console.log(`/language: ${rows.length} rows`);
        return res.render("language", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error"); // Return error response
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
