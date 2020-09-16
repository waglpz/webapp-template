<?php

declare(strict_types=1);

use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\Dotenv\Dotenv;
use Waglpz\Webapp\App;

use function Waglpz\Webapp\container;

\date_default_timezone_set('Europe/Berlin');

require __DIR__ . '/../vendor/autoload.php';

const PROJECT_CONFIG_DIRECTORY = __DIR__ . '/../config';

(new Dotenv())->bootEnv(__DIR__ . '/../.env');

/* phpcs:disable */
if (! \defined('APP_ENV')) {
    \define('APP_ENV', $_SERVER['APP_ENV'] ?? 'dev');
}
/* phpcs:enable */

$container = container();
$app       = $container->get(App::class);
$request   = $container->get(ServerRequestInterface::class);
\assert($app instanceof App && $request instanceof ServerRequestInterface);
$app->run($request);
