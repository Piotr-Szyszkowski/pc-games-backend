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
    cover_img VARCHAR,
    release_date DATE,
    category VARCHAR REFERENCES categories(cat_name) NOT NULL,
    review_intro VARCHAR NOT NULL,
    review_body VARCHAR NOT NULL,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    rating_count INT DEFAULT 0 NOT NULL,
    rating_sum INT DEFAULT 0 NOT NULL,
    rating DECIMAL DEFAULT 1.0 NOT NULL
);`);
    });
};

const dropTables = () => {
  return db.query(`DROP TABLE IF EXISTS reviews;`).then(() => {
    return db.query(`DROP TABLE IF EXISTS categories;`);
  });
};

module.exports = { createTables, dropTables };
