const selectReviews = require("../models/reviews-model");

const getReviews = (request, response, next) => {
  console.log(request.query);
  selectReviews(request, response).then((reviews) => {
    response.status(200).send({ reviews });
  });
};

module.exports = getReviews;
