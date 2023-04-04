const db = require("../db/connection");
const formatDate = require("../db/utilities/format-date.js");
const selectReviews = (request, response, next) => {
  return db
    .query("SELECT * FROM reviews ORDER BY release_date DESC;")
    .then((reviews) => {
      const reviewsWithFormattedDate = reviews.rows.map((reviewObject) => {
        const releaseDateString = new Date(
          reviewObject.release_date
        ).toISOString();
        reviewObject.release_date = formatDate(releaseDateString);
        return reviewObject;
      });
      return reviewsWithFormattedDate;
    });
};

module.exports = selectReviews;
