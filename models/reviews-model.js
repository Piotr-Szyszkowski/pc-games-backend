const db = require("../db/connection");
const format = require("pg-format");
const formatDate = require("../db/utilities/format-date.js");
const formatRating = require("../db/utilities/format-rating");

const selectReviews = async (order = "desc", sort_by = "release_date") => {
  const acceptedOrders = ["asc", "desc"];
  const acceptedSortByArray = ["release_date", "title", "upvotes", "downvotes"];

  if (!acceptedOrders.includes(order)) {
    return Promise.reject({
      status: 400,
      message: `Invalid <order> format. Please enter <asc> for ascending, or <desc> for descending.`,
    });
  }
  if (!acceptedSortByArray.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      message: `You canot sort reviews by ${sort_by}. Please enter a valid sort_by parameter.`,
    });
  }

  const reviewsFromDB = await db.query(
    `SELECT * FROM reviews ORDER BY ${sort_by} ${order};`
  );
  const reviewsWithFormattedDateAndRating = reviewsFromDB.rows.map(
    (reviewObject) => {
      const releaseDateString = new Date(
        `${reviewObject.release_date} GMT`
      ).toISOString();
      const ratingString = reviewObject.rating;
      reviewObject.release_date = formatDate(releaseDateString);
      reviewObject.rating = formatRating(ratingString);
      return reviewObject;
    }
  );
  return reviewsWithFormattedDateAndRating;
};

const selectReviewById = async (review_id) => {
  // console.log(`selectReviewById firing! and id is ${review_id}`);
  const queryString = format(
    `SELECT * FROM reviews WHERE review_id = %L;`,
    review_id
  );
  const reviewByIdRaw = await db.query(queryString);
  const theReview = reviewByIdRaw.rows[0];
  // console.log(typeof theReview.release_date);
  const releaseDateString = new Date(
    `${theReview.release_date} GMT`
  ).toISOString();
  theReview.release_date = formatDate(releaseDateString);
  theReview.rating = formatRating(theReview.rating);
  // console.log(theReview);
  return theReview;
};

module.exports = { selectReviews, selectReviewById };

// const selectReviews = async (order) => {
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
