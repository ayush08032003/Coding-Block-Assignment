CREATE DATABASE codingblocks;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE blog (
    blog_id SERIAL PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comment (
    comment_id SERIAL PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    blog_id INT NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_blog FOREIGN KEY (blog_id) REFERENCES blog(blog_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_comment FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

ALTER TABLE comment
ADD COLUMN parent_id INT,
ADD CONSTRAINT fk_parent_comment FOREIGN KEY (parent_id) REFERENCES comment(comment_id) ON DELETE CASCADE;
