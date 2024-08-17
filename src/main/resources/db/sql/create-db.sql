-- postgresユーザーでログイン
DROP DATABASE IF EXISTS db_work;

CREATE DATABASE db_work OWNER workuser 
ENCODING UTF8
-- LC_COLLATE 'ja_JP.UTF-8' LC_CTYPE 'ja_JP.UTF-8'
LC_COLLATE 'Japanese_Japan.932' LC_CTYPE 'Japanese_Japan.932'
;

ALTER DATABASE db_work SET timezone TO 'Asia/Tokyo'
;
