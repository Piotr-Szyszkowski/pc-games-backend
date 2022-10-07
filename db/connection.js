const { Pool } = require("pg");
const path = require("path");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: path.join(__dirname, "..", `.env.${ENV}`) });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error(`PGDATABASE or DATABASE_URL not set !!`);
}

const db = new Pool();

module.exports = db;
