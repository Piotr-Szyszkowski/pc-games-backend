const db = require("../db/connection");
const format = require("pg-format");
const formatDate = require("../db/utilities/format-date.js");
const formatRating = require("../db/utilities/format-rating");

const selectReviews = async (
  category = "%",
  order = "desc",
  sort_by = "release_date"
) => {
  const acceptedOrders = ["asc", "desc"];
  const acceptedSortByArray = [
    "release_date",
    "title",
    "upvotes",
    "downvotes",
    "rating",
  ];

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
    `SELECT * FROM reviews
    WHERE reviews.category LIKE '${category}'
    ORDER BY ${sort_by} ${order};`
  );
  const reviewsWithFormattedDateAndRating = reviewsFromDB.rows.map(
    (reviewObject) => {
      reviewObject.release_date = formatDate(reviewObject.release_date);
      reviewObject.rating = formatRating(reviewObject.rating);
      reviewObject.rating_sum = formatRating(reviewObject.rating_sum);
      return reviewObject;
    }
  );
  return reviewsWithFormattedDateAndRating;
};

const selectReviewById = async (review_id) => {
  const queryString = format(
    `SELECT * FROM reviews WHERE review_id = %L;`,
    review_id
  );
  const reviewByIdRaw = await db.query(queryString);
  const theReview = reviewByIdRaw.rows[0];
  // console.log(theReview.release_date);

  theReview.release_date = formatDate(theReview.release_date);
  theReview.rating = formatRating(theReview.rating);
  theReview.rating_sum = formatRating(theReview.rating_sum);

  return theReview;
};

const updateReviewById = async (
  review_id,
  upvote = false,
  downvote = false,
  givenRating = null
) => {
  // console.log(`updateReviewById firing!`);
  // console.log(
  //   `Upvote from controller is: ${upvote}. Type of upvote is: ${typeof upvote}`
  // );
  if (upvote) {
    const upvoteQueryStr = format(
      `UPDATE reviews SET upvotes = upvotes + 1
    WHERE reviews.review_id = %L
   RETURNING *;`,
      review_id
    );
    const upvoteQuery = await db.query(upvoteQueryStr);
    const reviewUpvoted = upvoteQuery.rows[0];
    reviewUpvoted.release_date = formatDate(reviewUpvoted.release_date);
    reviewUpvoted.rating = formatRating(reviewUpvoted.rating);
    reviewUpvoted.rating_sum = formatRating(reviewUpvoted.rating_sum);
    return reviewUpvoted;
  } else if (downvote) {
    const downvoteQueryStr = format(
      `UPDATE reviews SET downvotes = downvotes + 1
    WHERE reviews.review_id = %L
   RETURNING *;`,
      review_id
    );
    const downvoteQuery = await db.query(downvoteQueryStr);
    const reviewDownvoted = downvoteQuery.rows[0];
    reviewDownvoted.release_date = formatDate(reviewDownvoted.release_date);
    reviewDownvoted.rating = formatRating(reviewDownvoted.rating);
    reviewDownvoted.rating_sum = formatRating(reviewDownvoted.rating_sum);
    return reviewDownvoted;
  } else if (givenRating) {
    // console.log(typeof givenRating);
    // console.log(typeof review_id);
    const updateRatingSumAndCountQueryStr = format(
      `UPDATE reviews SET 
    rating_count = rating_count + 1,
    rating_sum = rating_sum + $1
     WHERE reviews.review_id = %L`,
      [givenRating, review_id]
    );
    const updateAndRetrieveRatingQueryStr = format(
      `UPDATE reviews SET
    rating = rating_sum / rating_count
    WHERE reviews.review_id = $1
    RETURNING *;`,
      review_id
    );
    const queryOne = await db.query(
      `UPDATE reviews SET 
    rating_count = rating_count + 1,
    rating_sum = rating_sum + $1
     WHERE reviews.review_id = $2`,
      [givenRating, review_id]
    );
    const queryTwo = await db.query(
      `UPDATE reviews SET
    rating = rating_sum / rating_count
    WHERE reviews.review_id = $1
    RETURNING *;`,
      [review_id]
    );
    const updatedReview = queryTwo.rows[0];
    updatedReview.release_date = formatDate(updatedReview.release_date);
    updatedReview.rating = formatRating(updatedReview.rating);
    updatedReview.rating_sum = formatRating(updatedReview.rating_sum);
    return updatedReview;
  }
};

module.exports = { selectReviews, selectReviewById, updateReviewById };
