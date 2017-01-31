CREATE TABLE category ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	name                 varchar(50)    ,
	CONSTRAINT pk_category PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE TABLE person ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	name_ko              varchar(50)    ,
	name_eng             varchar(100)    ,
	name_original        varchar(100)    ,
	birthdate            date    ,
	deathdate            date    ,
	link                 varchar(150)    ,
	nationality          date    ,
	CONSTRAINT pk_author PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE TABLE reading_list ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	start_date           date    ,
	finish_date          date    ,
	book_id              int  NOT NULL  ,
	rating               int UNSIGNED   ,
	review               text    ,
	CONSTRAINT pk_reading_list PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE TABLE series ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	name                 varchar(100)    ,
	CONSTRAINT pk_series PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE TABLE titles ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	title_ko             varchar(100)  NOT NULL  ,
	title_original       varchar(80)    ,
	original_book_id     int    ,
	authors_id           int  NOT NULL  ,
	translators          int    ,
	publisher_id         int  NOT NULL  ,
	published_date       date    ,
	pages                int    ,
	isnb13               varchar(13)    ,
	language             varchar(3)    ,
	category_id          int    ,
	series_id            int    ,
	series_number        int    ,
	description          text    ,
	link                 varchar(180)    ,
	CONSTRAINT pk_books PRIMARY KEY ( id ),
	CONSTRAINT idx_titles_0 UNIQUE ( authors_id ) ,
	CONSTRAINT pk_titles UNIQUE ( translators ) 
 );
 
 CREATE TABLE `translators-person` ( 
	translator_id        int  NOT NULL  ,
	person_id            int  NOT NULL  
 ) engine=InnoDB;
 
 CREATE TABLE `authors-person` ( 
	authors_id           int  NOT NULL  ,
	person_id            int  NOT NULL  ,
	CONSTRAINT `pk_authors-person` UNIQUE ( authors_id ) ,
	CONSTRAINT `pk_authors-person_0` UNIQUE ( person_id ) 
 ) engine=InnoDB;

CREATE INDEX idx_titles ON titles ( series_id );

ALTER TABLE titles MODIFY language varchar(3)     COMMENT 'ISO 639‑2';

ALTER TABLE `authors-person` ADD CONSTRAINT fk_title_person FOREIGN KEY ( person_id ) REFERENCES person( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `authors-person` ADD CONSTRAINT fk_person_title FOREIGN KEY ( authors_id ) REFERENCES titles( authors_id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `translators-person` ADD CONSTRAINT fk_person_translator FOREIGN KEY ( translator_id ) REFERENCES titles( translators ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `translators-person` ADD CONSTRAINT fk_translator_person FOREIGN KEY ( person_id ) REFERENCES person( id ) ON DELETE CASCADE ON UPDATE CASCADE;