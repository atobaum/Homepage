CREATE TABLE IF NOT EXISTS `author_to_person` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` bigint(20) NOT NULL,
  `person_id` int(11) NOT NULL,
  `type_id` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `authors_people_people_fk` (`person_id`),
  KEY `authors_people_titles_fk` (`book_id`),
  KEY `authors_people_author_type_fk` (`type_id`),
  CONSTRAINT `authors_people_author_type_fk` FOREIGN KEY (`type_id`) REFERENCES `author_type` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `authors_people_people_fk` FOREIGN KEY (`person_id`) REFERENCES `people` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `author_type` (
  `id` tinyint(3) unsigned NOT NULL,
  `name_en` varchar(20) NOT NULL,
  `name_ko` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `books` (
  `title_ko` varchar(100) NOT NULL,
  `title_original` varchar(100) DEFAULT NULL,
  `original_book_id` int(11) DEFAULT NULL,
  `publisher_id` int(11) NOT NULL,
  `published_date` date DEFAULT NULL,
  `pages` smallint(5) unsigned DEFAULT NULL,
  `language` varchar(3) DEFAULT NULL COMMENT 'ISO 639‑2',
  `category_id` int(11) DEFAULT NULL,
  `series_id` int(11) DEFAULT NULL,
  `series_number` int(11) DEFAULT NULL,
  `description` text,
  `link` varchar(255) DEFAULT NULL,
  `subtitle` varchar(100) DEFAULT NULL,
  `cover_URL` varchar(100) DEFAULT NULL,
  `isbn13` bigint(20) NOT NULL,
  `checked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`isbn13`),
  KEY `idx_titles` (`series_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `type` tinyint(4) NOT NULL,
  `content` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `people` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_ko` varchar(50) DEFAULT NULL,
  `name_eng` varchar(100) DEFAULT NULL,
  `name_original` varchar(100) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `deathdate` date DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `nationality` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `publishers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `nationality` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `readings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_started` date DEFAULT NULL,
  `date_finished` date DEFAULT NULL,
  `book_id` bigint(20) NOT NULL,
  `rating` tinyint(3) unsigned DEFAULT NULL,
  `comment` text,
  `link` varchar(255) DEFAULT NULL,
  `user` varchar(100) DEFAULT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_secret` tinyint(1) NOT NULL DEFAULT '0',
  `password` varchar(100) DEFAULT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `series` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



INSERT INTO `author_type` (`id`,`name_en`,`name_ko`) VALUES (1,'author','저자');
INSERT INTO `author_type` (`id`,`name_en`,`name_ko`) VALUES (2,'translator','역자');
INSERT INTO `author_type` (`id`,`name_en`,`name_ko`) VALUES (3,'supervisor','감수');
INSERT INTO `author_type` (`id`,`name_en`,`name_ko`) VALUES (4,'illustrator','그림');
INSERT INTO `author_type` (`id`,`name_en`,`name_ko`) VALUES (5,'photo','사진');
INSERT INTO `author_type` (`id`,`name_en`,`name_ko`) VALUES (6,'editor','엮음');













