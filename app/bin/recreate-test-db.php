<?php

declare(strict_types=1);

include __DIR__ . '/../vendor/autoload.php';

echo 'Recreating database for testing purpose...';
echo PHP_EOL;

use Aura\Sql\ExtendedPdo;
use Ifsnop\Mysqldump\Mysqldump;

$projectName = '@PROJECT_NAME@';
$dsn         = \sprintf('mysql:host=%1$s-db;dbname=%1$s', $projectName);
$username    = $projectName;
$password    = 'password';
$queries     = ['SET NAMES utf8mb4', 'SET FOREIGN_KEY_CHECKS=0'];
$dumpFile    = '/tmp/test-dump.sql';

try {
    $dump = new Mysqldump(
        $dsn,
        $username,
        $password,
        [
            'no-data'           => true,
            'add-drop-database' => false,
            'add-drop-table'    => false,
        ]
    );
    $dump->start($dumpFile);
    $db         = new ExtendedPdo(
        $dsn . '_test',
        $username,
        $password,
        [],
        $queries
    );
    $testDbName = $projectName . '_test';
    $db->exec(\sprintf('DROP DATABASE IF EXISTS `%s`', $testDbName));
    $db->exec(\sprintf('CREATE DATABASE IF NOT EXISTS `%s`', $testDbName));
    $db->exec(\sprintf('USE `%s`', $testDbName));
    $output    = [];
    $count     = 0;
    $fileLines = \file($dumpFile);
    \assert(\is_array($fileLines));
    foreach ($fileLines as $row) {
        $stmtLine = \trim($row);
        if (
            \strlen($stmtLine) !== 0
            && \strpos($stmtLine, '--') !== 0
            && \strpos($stmtLine, '/*') !== 0
            && \strpos($stmtLine, '//') !== 0
        ) {
            $output[] = $stmtLine;
            continue;
        }

        if (\strpos($row, ';', -1) === 0 || \count($output) <= 0) {
            continue;
        }

        $stmt = \implode('', $output);
        $db->exec($stmt);
        $output = [];
    }
} catch (\Throwable $e) {
    echo 'mysqldump-php error: ' . $e->getMessage();
    echo PHP_EOL;
    echo 'trace: ' . $e->getTraceAsString();
    echo PHP_EOL;
    exit(1);
}

echo 'Recreating done';
echo PHP_EOL;
echo PHP_EOL;
