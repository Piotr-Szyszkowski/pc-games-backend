const { selectReviews, selectReviewById } = require("../models/reviews-model");

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

module.exports = { getReviews, getReviewById };
