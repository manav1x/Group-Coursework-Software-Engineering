const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 4000;

app.get('/', (req, res) => {
    res.send('WELCOME TO DATA POPULAS!');
});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST || "localhost",
    user: "user",
    password: "password",
    database: "world",
});


app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/cities", (req, res) => {
    db.execute("SELECT * FROM `city`", (err, rows, fields) => {
        console.log(`/cities: ${rows.length} rows`);
        return res.send(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});