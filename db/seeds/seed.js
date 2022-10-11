const { createTables, dropTables } = require("../manage-tables.js");
const format = require("pg-format");
const db = require("../connection");

const seed = ({ reviewData }) => {
  console.log(reviewData);
  return dropTables()
    .then(() => {
      return createTables();
    })
    .then(() => {
      const reviewQueryStrForInsert = format(
        `INSERT INTO reviews (title, review_body)
      VALUES %L;`,
        reviewData.map((review) => {
          return [review.title, review.review_body];
        })
      );
      return db.query(reviewQueryStrForInsert);
    });
};

module.exports = seed;
