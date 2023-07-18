const db = require("./connection.js");

const createTables = () => {
  return db
    .query(
      `CREATE TABLE categories (
    cat_name VARCHAR PRIMARY KEY NOT NULL
  );`
    )
    .then(() => {
      return db.query(`CREATE TABLE users (
        username VARCHAR PRIMARY KEY NOT NULL,
        avatar_url VARCHAR
    );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    cover_img VARCHAR,
    release_date TIMESTAMP,
    category VARCHAR REFERENCES categories(cat_name) NOT NULL,
    review_intro VARCHAR NOT NULL,
    review_body VARCHAR NOT NULL,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    rating_count INT DEFAULT 0 NOT NULL,
    rating_sum DECIMAL DEFAULT 0 NOT NULL,
    rating DECIMAL DEFAULT 1.0 NOT NULL
);`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    review_id INT REFERENCES reviews(review_id) NOT NULL,
    created_by VARCHAR REFERENCES users(username),
    body VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT now()
    );`);
    });
};

const dropTables = () => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`);
    });
};

module.exports = { createTables, dropTables };
