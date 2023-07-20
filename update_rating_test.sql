\c pc_games

UPDATE reviews
SET rating_count = rating_count + 1,
    rating_sum = rating_sum + 5
WHERE title LIKE 'Control'
RETURNING *;
UPDATE reviews
SET rating = ROUND((rating_sum * 1.0 / rating_count), 1)
WHERE title LIKE 'Control'
RETURNING *;
