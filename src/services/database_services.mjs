import mysql from "mysql12/promise";
import City from "../models/city.mjs";
import Country from "../models/country.mjs";

export default class DatabaseService {
    conn;
    constructor(conn){
        this.conn = conn;
    }

    static async connect(){
        const conn = await mysql.createConnection({
            host: process.env.DATABASE_HOST || "localhost", 
            user: "user",
            password: "password",
            database: "world",
        });

        return new DatabaseService(conn);
    }

    async getCities() {
        try{
            const data = await this.conn.execute("SELECT * FROM `city`" );
            return data;
        }catch (err){
            console.error(err);
            return undefined;
        } 
    }
    async getCity(cityId){
        const sql = `
        SELECT city.*, country.Name AS Country, country.Region, country.Continent, country`
    }
}