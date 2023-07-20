const {
  selectReviews,
  selectReviewById,
  updateReviewById,
} = require("../models/reviews-model");

const getReviews = (request, response, next) => {
  const { category, order, sort_by } = request.query;
  selectReviews(category, order, sort_by)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch(next);
};

const getReviewById = (request, response, next) => {
  const { review_id } = request.params;

  selectReviewById(review_id).then((reviewWithId) => {
    response.status(200).send(reviewWithId);
  });
};

const patchReviewById = (request, response, next) => {
  const { review_id } = request.params;
  const { upvote, downvote, givenRating } = request.body;

  // console.log(`patchReviewById firing!`);
  // console.log(
  //   `givenRating from req.body is: ${givenRating}. Type of upvote is: ${typeof givenRating}`
  // );
  updateReviewById(review_id, upvote, downvote, givenRating).then(
    (updatedReviewFromModel) => {
      response.status(200).send({ review: updatedReviewFromModel });
    }
  );
};

module.exports = { getReviews, getReviewById, patchReviewById };
