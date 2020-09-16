<?php

declare(strict_types=1);

$projektName = '@PROJECT_NAME@';

return [
    'dsn'      => 'mysql:host=' . $projektName . '-db;dbname=' . $projektName . '_test',
    'username' => $projektName,
    'password' => 'password',
];
