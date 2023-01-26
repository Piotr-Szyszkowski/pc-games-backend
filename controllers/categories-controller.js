const selectCategories = require("../models/categories-model.js");

const getCategories = (request, response, next) => {
  selectCategories(request, response).then((something) => {
    response.status(200).send(something);
  });
};

module.exports = getCategories;
