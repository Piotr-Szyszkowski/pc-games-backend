\c pc_games

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
