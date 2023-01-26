const db = require("../db/connection");
const selectCategories = (request, response) => {
  return db.query("SELECT * FROM categories;").then((x) => {
    console.log(x);
    return "Fake categories - I'm just a string";
  });
};

module.exports = selectCategories;
