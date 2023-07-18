const db = require("../db/connection");
const { formatDateAndTime } = require("../db/utilities/format-date");

const selectComments = async (review_id) => {
  const commentsFromDB = await db.query(`SELECT * FROM comments
  WHERE review_id = ${review_id}
  ORDER BY created_at DESC;`);

  const formattedCommentsFromDB = commentsFromDB.rows.map((commentObj) => {
    const { created_at, ...restOfComment } = commentObj;
    const createdAtString = new Date(created_at).toISOString();
    const formattedCommentObj = {
      created_at: formatDateAndTime(createdAtString),
      ...restOfComment,
    };
    console.log(formattedCommentObj);
    return formattedCommentObj;
  });
  return formattedCommentsFromDB;
};

module.exports = { selectComments };
