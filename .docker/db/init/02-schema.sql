CREATE DATABASE IF NOT EXISTS `@PROJECT_NAME@`;

USE `@PROJECT_NAME@`;

CREATE TABLE `__migrations` (
  `migration` int(11) NOT NULL,
  UNIQUE KEY `__migrations_migration_uindex` (`migration`)
) ENGINE = InnoDB;
