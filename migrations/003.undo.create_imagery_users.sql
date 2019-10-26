ALTER TABLE imagery_images
    DROP COLUMN IF EXISTS author_id;

DROP TABLE IF EXISTS imagery_users;