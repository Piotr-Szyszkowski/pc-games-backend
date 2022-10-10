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
      ('Doom (1993)', 'A science fiction first-person shooter by id Software, previously known mainly due to the Commander Keen arcade series and the ground-breaking Wolfenstein 3D.'),
      ('Max Payne','Max Payne is an action game with a third person perspective (TPP), created by the Finnish studio Remedy Entertainment.');`);
    });
};

module.exports = seed;
