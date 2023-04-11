const db = require("../db/connection");
const formatDate = require("../db/utilities/format-date.js");
const selectReviews = async (order) => {
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

// const selectReviews = (request, response, next) => {
//   const { order } = request.query;
//   console.log(order);
//   return db
//     .query("SELECT * FROM reviews ORDER BY release_date DESC;")
//     .then((reviews) => {
//       const reviewsWithFormattedDate = reviews.rows.map((reviewObject) => {
//         const releaseDateString = new Date(
//           reviewObject.release_date
//         ).toISOString();
//         reviewObject.release_date = formatDate(releaseDateString);
//         return reviewObject;
//       });
//       return reviewsWithFormattedDate;
//     });
// };
