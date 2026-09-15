USE portfolio_db;
SET SESSION sql_require_primary_key = 0;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 15, 2026 at 11:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portfolio_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password_hash`) VALUES
(1, 'kasun', 'kasun123');

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `issuer` varchar(100) NOT NULL,
  `issue_date` date DEFAULT NULL,
  `credential_link` varchar(255) DEFAULT NULL,
  `certificate_image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certifications`
--

INSERT INTO `certifications` (`id`, `title`, `issuer`, `issue_date`, `credential_link`, `certificate_image_url`) VALUES
(4, 'Certificate ', 'SIBA Campus', '2026-12-02', NULL, '/uploads/1788684027282.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `degree_course_name` varchar(255) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `start_date` varchar(50) DEFAULT NULL,
  `end_date` varchar(50) DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT 0,
  `logo_url` varchar(255) DEFAULT NULL,
  `institution_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`id`, `degree_course_name`, `institution_name`, `start_date`, `end_date`, `is_current`, `logo_url`, `institution_url`, `description`) VALUES
(1, 'BSc in Information Technology', 'Sri Lanka International Buddhist Academy (SIBA) Campus, Pallekale', '2023', '', 1, '/uploads/1788676666615.png', 'https://siba.edu.lk/', ''),
(2, 'G.C.E. Advance Level', 'MR/Pallegama Secondary School', '2017', '', 0, '/uploads/1788676740248.jpeg', 'https://www.facebook.com/p/MRPallegama-Secondary-School-100057249644397/', '* Obtained 1 C pass and 1 S pass, including an A pass for Accounting (Index Number: 6105157) - 2017'),
(3, 'IELTS Training Program', 'Sri Lanka International Buddhist Academy (SIBA) Campus, Pallekale', '2024', '2025', 0, '/uploads/1788676918786.png', 'https://siba.edu.lk/', ''),
(4, 'Certificate Course in English', 'Sun Ray Institute Of English, Sun-Ray Academy, Ambalantota', '2016', '', 0, '/uploads/1788678096590.jpeg', 'https://sunrayacademy.lk/English.php', ''),
(5, 'G.C.E. Ordinary Level', 'MR/Pallegama Secondary School', '2013', '', 0, '/uploads/1788678290529.jpeg', 'https://www.facebook.com/p/MRPallegama-Secondary-School-100057249644397/', '* Obtained 4 B’s, 2 C’s and 2 S (Index no:31792839) - 2013\r\n\r\n* Obtained a C pass for English (Index number: 71693726) - 2017');

-- --------------------------------------------------------

--
-- Table structure for table `experience`
--

CREATE TABLE `experience` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `organization` varchar(100) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` enum('Education','Work') DEFAULT 'Work'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `experience`
--

INSERT INTO `experience` (`id`, `title`, `organization`, `start_date`, `end_date`, `description`, `type`) VALUES
(1, 'Information Technology Degree', 'SIBA Campus', '2023-01-01', '2026-08-01', 'Studied core IT subjects including software development, database architecture, and web technologies.', 'Education'),
(2, 'Founder & IT Professional', 'Garnet', '2024-01-01', NULL, 'Operating an IT company providing software solutions, web development, and graphic design services.', 'Work');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message_body` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `subject`, `message_body`, `is_read`, `created_at`) VALUES
(1, 'kasun disanayaka', 'user@gmail.com', 'How to deploy the web application', 'Test 01', 1, '2026-09-08 19:28:09'),
(2, 'Kasun Chathuranga', 'Kasun123@gmail.com', 'Message Check 1', 'The use of hypothesis testing as a theoretical basis for random testing was described by Howden in Functional Testing and Analysis. The book also contained the development of a simple formula for estimating the number of tests n that are needed to have confidence at least 1-1/n in a failure rate of no larger than 1/n. The formula is the lower bound nlogn, which indicates the large number of failure-free tests needed to have even modest confidence in a modest failure rate bound.[', 1, '2026-09-08 19:38:05');

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL DEFAULT 1,
  `full_name` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `github_link` varchar(255) DEFAULT NULL,
  `linkedin_link` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`id`, `full_name`, `title`, `bio`, `profile_image_url`, `email`, `github_link`, `linkedin_link`, `phone`, `address`, `whatsapp`) VALUES
(1, 'Kasun Chathuranga', 'Full-Stack Developer ', 'I am a passionate IT professional specialized in creating scalable web applications, graphic design, and user-centric interfaces. I love building things that solve real-world problems.', '/uploads/1789454835495.jpg', 'kasundeni1997@gmail.com', 'https://github.com/KasunChathu97', 'https://linkedin.com/', '0716853249', '\"sanka\", Pallegama', '0762251786');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `tech_stack` varchar(255) DEFAULT NULL,
  `image_urls` text DEFAULT NULL,
  `github_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `live_link` varchar(255) DEFAULT NULL,
  `project_type` varchar(50) DEFAULT 'Solo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `tech_stack`, `image_urls`, `github_link`, `created_at`, `live_link`, `project_type`) VALUES
(1, 'NextStop Mobile App', 'Public transit tracking application with real-time updates.', 'React Native, Node.js', '', '#', '2026-08-29 17:20:23', NULL, 'Solo'),
(2, 'Garnet IT Solutions', 'Branding and logo design for an IT company, featuring a signature gemstone G logo.', 'Graphic Design, Illustrator', '', '#', '2026-08-29 17:20:23', NULL, 'Solo'),
(3, 'Thantra Incense Packaging', 'Product packaging box design for the Thantra incense brand.', 'Photoshop, Packaging Design', '[\"/uploads/1788803416185.png\"]', 'https://github.com/Garnet-Technologies/TheerthaArtGalleryNew.git', '2026-08-29 17:20:23', 'https://theertha.lk/', 'Group'),
(4, 'SL Round Tours Banners', 'Promotional travel banner designs for regional tour packages across Sri Lanka.', 'Graphic Design, UI Layouts', '', '#', '2026-08-29 17:20:23', NULL, 'Solo'),
(5, 'NMDS', 'IT Company', 'ReactJS, HTML', '[\"/uploads/1788782249343.png\"]', 'https://github.com/KasunChathu97/nmdskandy.git', '2026-08-29 17:52:43', 'https://nmdskandy.lk/', 'Solo'),
(6, 'NextStop', 'Bus Tracking App', 'Reactjs, Nodejs, MongoDB', '[\"/uploads/1788802399010.png\"]', 'https://github.com/KasunChathu97/NextStop.git', '2026-09-07 17:33:19', NULL, 'Solo');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL,
  `tagline` text DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `whatsapp_url` varchar(255) DEFAULT NULL,
  `fiverr_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `tagline`, `facebook_url`, `linkedin_url`, `github_url`, `whatsapp_url`, `fiverr_url`) VALUES
(1, 'Building modern digital experiences with passion and precision.', '', '', 'https://github.com/KasunChathu97?tab=repositories', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `main_category` enum('Soft Skills','Languages','Technical Skills') NOT NULL,
  `sub_category` varchar(255) DEFAULT NULL,
  `proficiency_text` varchar(255) DEFAULT NULL,
  `proficiency_percentage` int(11) DEFAULT NULL,
  `skill_logo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `name`, `main_category`, `sub_category`, `proficiency_text`, `proficiency_percentage`, `skill_logo_url`) VALUES
(1, 'Problem Solving', 'Soft Skills', NULL, NULL, NULL, NULL),
(2, 'English', 'Languages', NULL, 'Basic', NULL, NULL),
(3, 'Languages', 'Technical Skills', 'HTML ', NULL, NULL, '/uploads/1788715992606.webp'),
(4, 'Adaptability', 'Soft Skills', '', NULL, NULL, NULL),
(5, 'Sinhala', 'Languages', NULL, 'Fluent', NULL, NULL),
(6, 'Teamwork', 'Soft Skills', NULL, NULL, 95, NULL),
(7, 'Communication Skills', 'Soft Skills', NULL, NULL, 90, NULL),
(8, 'Time Management', 'Soft Skills', NULL, NULL, 85, NULL),
(9, 'Attention to Detail', 'Soft Skills', NULL, NULL, 80, NULL),
(10, 'Self-Learner', 'Soft Skills', NULL, NULL, 85, NULL),
(11, 'Work Ethic', 'Soft Skills', NULL, NULL, 85, NULL),
(12, 'Languages', 'Technical Skills', 'CSS', NULL, NULL, '/uploads/1788718673436.png'),
(13, 'Frontend Development', 'Technical Skills', 'Bootstrap', NULL, NULL, '/uploads/1788718828215.webp');

-- --------------------------------------------------------

--
-- Table structure for table `working_experience`
--

CREATE TABLE `working_experience` (
  `id` int(11) NOT NULL,
  `position` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `start_date` varchar(50) DEFAULT NULL,
  `end_date` varchar(50) DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT 0,
  `company_logo_url` varchar(255) DEFAULT NULL,
  `company_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `working_experience`
--

INSERT INTO `working_experience` (`id`, `position`, `company_name`, `start_date`, `end_date`, `is_current`, `company_logo_url`, `company_url`) VALUES
(1, 'IT Assistant', 'MR/Deniyaya Central College, Deniyaya', '2018', '2023', 0, '/uploads/1788672861008.jpeg', 'https://www.facebook.com/p/Deniyaya-Central-College-100063626617293/'),
(2, 'Gallery Assistant Manager', 'Millennium Art Contemporary (MIAC), Millennium City, Oruwala', '2025 Octomber', '', 1, '/uploads/1788672972432.png', 'https://miac.lk/');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `working_experience`
--
ALTER TABLE `working_experience`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `experience`
--
ALTER TABLE `experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `working_experience`
--
ALTER TABLE `working_experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
