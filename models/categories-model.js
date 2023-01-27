const db = require("../db/connection");
const selectCategories = (request, response) => {
  return db.query("SELECT * FROM categories;").then((categories) => {
    return categories.rows;
  });
};

module.exports = selectCategories;
