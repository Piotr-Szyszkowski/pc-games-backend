const { selectComments, insertComments } = require("../models/comments-model");

const getComments = (request, response, next) => {
  const { review_id } = request.params;
  selectComments(review_id).then((comments) => {
    response.status(200).send({ comments });
  });
};

const postComments = (request, response, next) => {
  const { review_id } = request.params;
  const newComment = request.body;
  insertComments(review_id, newComment).then((comment) => {
    response.status(201).send({ comment });
  });
};

module.exports = { getComments, postComments };
