const { selectReviews, selectReviewById } = require("../models/reviews-model");

const getReviews = (request, response, next) => {
  const { order, sort_by } = request.query;
  selectReviews(order, sort_by)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch(next);
};

const getReviewById = (request, response, next) => {
  // console.log(`getReviewById triggering!`);
  const { review_id } = request.params;
  // console.log(`review_id from "params" is ${review_id}`);
  selectReviewById(review_id).then((reviewWithId) => {
    response.status(200).send(reviewWithId);
  });
};

module.exports = { getReviews, getReviewById };
