CREATE TABLE imagery_comments (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    text TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    image_id INTEGER
        REFERENCES imagery_images(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES imagery_users(id) ON DELETE CASCADE NOT NULL
);