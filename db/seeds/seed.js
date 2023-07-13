const { createTables, dropTables } = require("../manage-tables.js");
const format = require("pg-format");
const db = require("../connection");

const seed = ({ categoryData, userData, reviewData }) => {
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
      const userQueryStrForInsert = format(
        `INSERT INTO users(username, avatar_url) VALUES %L;`,
        userData.map(({ username, avatar_url }) => {
          return [username, avatar_url];
        })
      );
      return db.query(userQueryStrForInsert);
    })
    .then(() => {
      const reviewQueryStrForInsert = format(
        `INSERT INTO reviews (title, cover_img, release_date, category, review_intro, review_body, upvotes, downvotes, rating_count,  rating_sum, rating)
      VALUES %L RETURNING *;`,
        reviewData.map(
          ({
            title,
            cover_img,
            release_date,
            category,
            review_intro,
            review_body,
            upvotes,
            downvotes,
            rating_count,
            rating_sum,
            rating,
          }) => {
            const calculatedRating = Number(
              rating_sum === 0 ? 1.0 : rating_sum / rating_count
            ).toFixed(1);
            return [
              title,
              cover_img,
              release_date,
              category,
              review_intro,
              review_body,
              upvotes,
              downvotes,
              rating_count,
              rating_sum,
              calculatedRating,
            ];
          }
        )
      );
      return db.query(reviewQueryStrForInsert);
    });
  // .then((dataInsertedInReviews) => {
  //   console.log(dataInsertedInReviews);
  // });
};

module.exports = seed;
