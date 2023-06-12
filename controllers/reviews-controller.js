const selectReviews = require("../models/reviews-model");

const getReviews = (request, response, next) => {
  const { order, sort_by } = request.query;
  selectReviews(order, sort_by)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch(next);
};

module.exports = getReviews;
