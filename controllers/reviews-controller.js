const selectReviews = require("../models/reviews-model");

const getReviews = (request, response, next) => {
  const { order } = request.query;
  selectReviews(order).then((reviews) => {
    response.status(200).send({ reviews });
  });
};

module.exports = getReviews;
