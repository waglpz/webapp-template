<?php

declare(strict_types=1);

use Waglpz\Webapp\ExceptionHandler;

use function Waglpz\Webapp\container;

\Locale::setDefault('de_DE.utf8');

return [
    'apiVersion'          => '0.1.0',
    'logErrorsDir'        => __DIR__ . '/../var/log',
    'anonymizeLog'       => [
        'SERVER' => ['DB_PASSWD'],
    ],
    'db'                  => include 'db.php',
    'router'              => include 'router.php',
    'logger'              => include 'logger.php',
    'view'                => [
        'templates'           => \dirname(__DIR__) . '/templates/',
        'attributes'          => [
            'webseitenTitle' => '@PROJECT_NAME@ web und REST API application',
            'helpers' => static fn () => container()->get('$viewHelpers'),
        ],
        'layout'              => 'layout.phtml',
    ],
    'viewHelpers'         => [
        'dateFormat' => \Waglpz\View\Helpers\DateFormatter::class,
    ],
    'exception_handler'   => ExceptionHandler::class,
    // uncomment to enable firewall
    //'firewall'            => include 'firewall.php',
    'swagger_scheme_file' => __DIR__ . '/../swagger.json',
];