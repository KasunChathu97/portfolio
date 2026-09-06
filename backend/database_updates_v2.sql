-- MySQL Query to add github_link to the profile table
-- (Run this if your table does not already have this column)
ALTER TABLE profile 
ADD COLUMN github_link VARCHAR(255) DEFAULT NULL;
