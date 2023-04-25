import mysql from "mysql2/promise";
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
        SELECT city.*, country.Name AS Country, country.Region, country.Continent, country.population as Country
        FROM CITY
        INNER JOIN country ON country.code = city.CountryCode
        WEHRE JOIN country ON country.Code = city.CountryCode
        WHERE city.ID = ${cityId}
        `;
        const [rows,fields] = await this.conn.execute(sql);
        const data = rows[0];
        console.log(data);
        const city = new City(
            data.ID,
            data.CountryCode,
            data.District,
            data.Population
        );
        const country = new Country(
            data.Code,
            data.Country,
            data.Continent,
            data.Region,
            data.CountryPopulation
        );
        city.country = country;
        return city;
    }
}