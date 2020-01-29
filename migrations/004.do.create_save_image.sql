CREATE TABLE saved_images(
    user_id INTEGER REFERENCES imagery_users(id) ON DELETE CASCADE,
    PRIMARY KEY (image_id, user_id)
);