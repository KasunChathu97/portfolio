-- MySQL Queries to update existing tables to support image paths

-- 1. PROFILE TABLE
-- (Assuming `profile` table already exists and has `headshot_url` column)
-- If not, here is the command to add it:
ALTER TABLE profile 
ADD COLUMN headshot_url VARCHAR(255) DEFAULT NULL;

-- 2. PROJECTS TABLE
-- (Assuming `projects` table already has `image_url` column)
-- If not, here is the command to add it:
ALTER TABLE projects 
ADD COLUMN image_url VARCHAR(255) DEFAULT NULL;

-- 3. EXPERIENCE TABLE
-- We need to add `image_url` for company/school logos.
ALTER TABLE experience 
ADD COLUMN image_url VARCHAR(255) DEFAULT NULL;

-- 4. CERTIFICATIONS TABLE
-- We need to add `image_url` for certificate badges/images.
ALTER TABLE certifications 
ADD COLUMN image_url VARCHAR(255) DEFAULT NULL;

-- ----------------------------------------------------
-- FULL TABLE CREATION SCRIPTS (If you are starting fresh)
-- ----------------------------------------------------

CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    bio TEXT,
    headshot_url VARCHAR(255),
    email VARCHAR(100),
    github_link VARCHAR(255),
    linkedin_link VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    tech_stack VARCHAR(255),
    image_url VARCHAR(255),
    project_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    organization VARCHAR(150) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    type VARCHAR(50) DEFAULT 'Job',
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    issuer VARCHAR(150),
    issue_date DATE,
    credential_link VARCHAR(255),
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    proficiency INT DEFAULT 0,
    category VARCHAR(100)
);
