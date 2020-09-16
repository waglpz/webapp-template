<?php

declare(strict_types=1);

return [
    'dsn'      => 'mysql:host=' . \getenv('DB_HOST') . ';dbname=' . \getenv('DB_NAME'),
    'username' => \getenv('DB_USER'),
    'password' => \getenv('DB_PASSWD'),
];
