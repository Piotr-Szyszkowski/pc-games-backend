const { createTables, dropTables } = require("../manage-tables.js");
const format = require("pg-format");
const db = require("../connection");

const seed = () => {
  return dropTables()
    .then(() => {
      return createTables();
    })
    .then(() => {
      return db.query;
    });
};
