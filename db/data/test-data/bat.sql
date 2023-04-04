\c pc_games_test

-- SELECT * FROM reviews;

-- SELECT * FROM categories;

-- SELECT title, release_date, review_intro, review_body, category FROM reviews
-- LEFT JOIN categories ON category = cat_name;

SELECT * FROM reviews ORDER BY release_date DESC;