\c pc_games_test
SELECT * FROM reviews;
-- ORDER BY release_date
-- OFFSET 1 ROWS FETCH NEXT 2 ROWS ONLY;
-- UPDATE reviews SET upvotes = upvotes + 1
--   WHERE reviews.review_id = 4
-- RETURNING *;
-- WHERE category = 'RPG';
-- UPDATE reviews SET 
-- rating_count = rating_count + 1,
-- rating_sum = rating_sum + 7.5
--  WHERE reviews.review_id = 3;
-- UPDATE reviews SET
-- rating = rating_sum / rating_count
-- WHERE reviews.review_id = 3
-- RETURNING *;
-- *********************************************************
-- CREATE TABLE users (
--     username VARCHAR PRIMARY KEY NOT NULL,
--     avatar_url VARCHAR
-- );

-- INSERT INTO
--  users(username, avatar_url)
-- VALUES
--  ('Graveman82', 'https://images.squarespace-cdn.com/content/v1/5fbc4a62c2150e62cfcb09aa/08754151-5516-41e7-95e1-54f9644f2bd9/darth-revan-star-wars-closeup.jpg'),
--  ('ToryTiller', 'https://i.kinja-img.com/gawker-media/image/upload/c_fit,f_auto,g_center,q_60,w_645/a57c78bc678d1a158a9eed3c52f6b77d.jpg')
--   RETURNING *;
-- DROP TABLE IF EXISTS users;
-- SELECT * FROM users;