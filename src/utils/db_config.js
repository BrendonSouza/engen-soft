const { Client } = require('pg');
require("dotenv").config()

const database = new Client({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});

database.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log("Connected to database");
    }
});

module.exports = database;
