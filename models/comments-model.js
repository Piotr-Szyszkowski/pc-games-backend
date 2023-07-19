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
    return formattedCommentObj;
  });
  return formattedCommentsFromDB;
};

const insertComments = async (review_id, newComment) => {
  const { username, comment_body } = newComment;

  return db
    .query(
      `INSERT INTO comments (review_id, created_by, body)
  VALUES ($1, $2, $3)
  RETURNING *;`,
      [review_id, username, comment_body]
    )
    .then((dbResponse) => {
      const { created_at, ...restOfRawComment } = dbResponse.rows[0];
      const createdAtString = new Date(created_at).toISOString();
      const formattedAddedComment = {
        created_at: formatDateAndTime(createdAtString),
        ...restOfRawComment,
      };
      return formattedAddedComment;
    });
};

module.exports = { selectComments, insertComments };
