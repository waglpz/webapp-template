<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

if (\file_exists(__DIR__ . '/../.env')) {
    (new \Symfony\Component\Dotenv\Dotenv())->usePutenv()->load(__DIR__ . '/../.env');
}

/* phpcs:disable */
if (! \defined('APP_ENV')) {
    \define('APP_ENV', \getenv('APP_ENV') ?? 'dev');
}
/* phpcs:enable */

$config = include __DIR__ . '/../config/main.php';

return new \Waglpz\Webapp\App($config);
