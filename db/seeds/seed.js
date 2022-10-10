const { createTables, dropTables } = require("../manage-tables.js");
const format = require("pg-format");
const db = require("../connection");

const seed = () => {
  return dropTables()
    .then(() => {
      return createTables();
    })
    .then(() => {
      return db.query(`INSERT INTO reviews (title, review_body)
      VALUES      
      ('Doom', 'Super classic father of all FPS games out there');`);
    });
};

module.exports = seed;
