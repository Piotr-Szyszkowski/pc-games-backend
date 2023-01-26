const db = require("./connection.js");

const createTables = () => {
  return db
    .query(
      `CREATE TABLE categories (
    cat_name VARCHAR PRIMARY KEY NOT NULL
  );`
    )
    .then(() => {
      return db.query(`CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    release_date DATE,
    category VARCHAR REFERENCES categories(cat_name) NOT NULL,
    review_intro VARCHAR NOT NULL,
    review_body VARCHAR NOT NULL
);`);
    });
};

const dropTables = () => {
  return db.query(`DROP TABLE IF EXISTS reviews;`).then(() => {
    return db.query(`DROP TABLE IF EXISTS categories;`);
  });
};

module.exports = { createTables, dropTables };
