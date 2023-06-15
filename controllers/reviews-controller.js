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
  const { upvote } = request.body;
  const { downvote } = request.body;
  // console.log(`patchReviewById firing!`);
  // console.log(
  //   `Upvote from req.body is: ${upvote}. Type of upvote is: ${typeof upvote}`
  // );
  updateReviewById(review_id, upvote, downvote).then(
    (updatedReviewFromModel) => {
      response.status(200).send({ review: updatedReviewFromModel });
    }
  );
};

module.exports = { getReviews, getReviewById, patchReviewById };
