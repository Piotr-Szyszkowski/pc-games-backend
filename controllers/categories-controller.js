const selectCategories = require("../models/categories-model.js");

const getCategories = (request, response, next) => {
  selectCategories(request, response).then((categories) => {
    response.status(200).send({ categories });
  });
};

module.exports = getCategories;
