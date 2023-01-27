const { createTables, dropTables } = require("../manage-tables.js");
const format = require("pg-format");
const db = require("../connection");

const seed = ({ categoryData, reviewData }) => {
  return dropTables()
    .then(() => {
      return createTables();
    })
    .then(() => {
      const categoryQueryStrForInsert = format(
        `INSERT INTO categories (cat_name)
      VALUES %L;`,
        categoryData.map(({ cat_name }) => {
          return [cat_name];
        })
      );

      return db.query(categoryQueryStrForInsert);
    })
    .then(() => {
      const reviewQueryStrForInsert = format(
        `INSERT INTO reviews (title, release_date, category, review_intro, review_body)
      VALUES %L;`,
        reviewData.map(
          ({ title, release_date, category, review_intro, review_body }) => {
            return [title, release_date, category, review_intro, review_body];
          }
        )
      );
      return db.query(reviewQueryStrForInsert);
    });
};

module.exports = seed;
