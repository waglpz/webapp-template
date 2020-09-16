<?php

declare(strict_types=1);

if (\file_exists(__DIR__ . '/../.env')) {
    (new \Symfony\Component\Dotenv\Dotenv())->usePutenv()->load(__DIR__ . '/../.env');
}

/* phpcs:disable */
if (! \defined('APP_ENV')) {
    \define('APP_ENV', \getenv('APP_ENV') ?? 'dev');
}
/* phpcs:enable */

require __DIR__ . '/../vendor/autoload.php';

$request = (new \Aidphp\Http\ServerRequestFactory())->createServerRequestFromGlobals();
$config  = include \dirname(__DIR__) . '/config/main.php';
$app     = new \Waglpz\Webapp\App($config);
$app->run($request);
