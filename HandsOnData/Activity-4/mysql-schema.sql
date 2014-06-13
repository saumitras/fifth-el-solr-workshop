-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.5.8-log - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL version:             7.0.0.4053
-- Date/time:                    2014-03-21 17:38:42
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;

-- Dumping database structure for stacksearch
DROP DATABASE IF EXISTS `stacksearch`;
CREATE DATABASE IF NOT EXISTS `stacksearch` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `stacksearch`;


-- Dumping structure for table stacksearch.comments
DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` varchar(20) NOT NULL,
  `commenttext` text NOT NULL,
  `postid` varchar(20) NOT NULL,
  `score` int(1) NOT NULL,
  `userid` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.


-- Dumping structure for table stacksearch.post
DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
  `id` varchar(20) NOT NULL,
  `site` varchar(20) NOT NULL,
  `posttype` varchar(10) NOT NULL,
  `post` text NOT NULL,
  `creationdate` varchar(50) NOT NULL,
  `score` varchar(5) NOT NULL,
  `parentid` varchar(20) NOT NULL,
  `acceptedansid` varchar(20) NOT NULL,
  `title` varchar(1000) NOT NULL,
  `tags` varchar(300) NOT NULL,
  `answercount` varchar(5) NOT NULL,
  `commentcount` varchar(5) NOT NULL,
  `favoritecount` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.


-- Dumping structure for table stacksearch.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(20) NOT NULL,
  `displayname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40014 SET FOREIGN_KEY_CHECKS=1 */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
