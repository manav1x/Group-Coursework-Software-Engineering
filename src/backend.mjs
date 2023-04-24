import express from "express";
import mysql from "mysql2/promise";


const app = express();
const port = 4000;

app.set("view engine", "pug");

app.use(express.static("static"));

console.log(process.env.NODE_ENV);

app.get('/', (req, res) => {
    res.render("index");
});

const db = await mysql.createConnection({ 
    host: process.env.DATABASE_HOST || "localhost",
    user: "user",
    password: "password",
    database: "world",
});

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/cities", async (req, res) => { 
    try{
        const [rows, fields] = await db.execute("SELECT * FROM `city`");
        //console.log(`/cities: ${rows.length} rows`);
        return res.render("cities", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.send("Internal Server Error"); 
    }

});

app.get("/country", async (req, res) => { 
    try {
        const [rows, fields] = await db.execute("SELECT * FROM `country`"); 
        //console.log(`/country: ${rows.length} rows`);
        return res.render("country", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.send("Internal Server Error"); 
            }
});

app.get("/language", async (req, res) => { 
    try {
        const [rows, fields] = await db.execute("SELECT * FROM `countrylanguage`"); 
        //console.log(`/language: ${rows.length} rows`);
        return res.render("language", {rows, fields});
    } catch (err) {
        console.error(err);
        return res.send("Internal Server Error"); 
    }
});


/*app.post('/cities/:id', async (req, res) => {
    const cityId  = req.params.id;
    const { name } = req.body;
    const sql = `
        UPDATE city
        SET Name = '${name}'
        WHERE ID = '${cityId}';
    `
    await Connection.execute(sql);
    return res.redirect(`/cities/${cityId}`)
});*/



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
