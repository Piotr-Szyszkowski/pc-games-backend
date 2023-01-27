const db = require("../db/connection");
const selectReviews = (request, response, next) => {
  return db.query("SELECT * FROM reviews;").then((reviews) => {
    return reviews.rows;
  });
};

module.exports = selectReviews;
