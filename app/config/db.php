<?php

declare(strict_types=1);

$default = [
    'dsn'      => '',
    'username' => null,
    'password' => null,
    'options'  => [], // driver attributes/options as key-value pairs
    'queries'  => ['SET NAMES utf8mb4'], // queries to execute after connection
    'profiler' => null,
];

$envSpecificConfig = __DIR__ . '/db.' . APP_ENV . '.php';

return is_file($envSpecificConfig) ? array_replace_recursive($default, include $envSpecificConfig) : $default;
