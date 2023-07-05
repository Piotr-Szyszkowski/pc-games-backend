const { selectComments } = require("../models/comments-model");

const getComments = (request, response, next) => {
  const { review_id } = request.params;
  selectComments(review_id).then((comments) => {
    response.status(200).send({ comments });
  });
};

module.exports = { getComments };
