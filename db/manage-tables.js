const db = require("./connection.js");

const createTables = () => {
  return db.query(`CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        review_body VARCHAR NOT NULL
    );`);
};

const dropTables = () => {
  return db.query(`DROP TABLE IF EXISTS reviews;`);
};

module.exports = { createTables, dropTables };
