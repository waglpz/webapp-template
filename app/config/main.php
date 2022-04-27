<?php

declare(strict_types=1);

use Waglpz\Webapp\ExceptionHandler;

use function Waglpz\Webapp\container;

\Locale::setDefault('de_DE.utf8');

return [
    'apiVersion'          => '0.1.0',
    'logErrorsDir'        => __DIR__ . '/../var/log',
    'anonymizeLog' => [
        '_SERVER' => [
            'DB_PASSWD' => '*****',
            'DB_USER' => '*****',
        ],
        '_POST' => [/* set here necessary keys wich should be anonymized in log*/],
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
// To enable and using view helper component please
// install webapp-view-helpers via composer require waglpz/webapp-view-helpers
// after installing pls uncomment next block.
//    'viewHelpers'         => [
//        'dateFormat'     => DateFormatter::class,
//        'modalDialog'    => ModalDialog::class,
//        'sortingButtons' => SortingButtons::class,
//        'navigation'     => Navigation::class,
//        'tabs'           => Tabs::class,
//        'workflowLog'    => WorkflowLog::class,
//        'url'            => static fn (
//            string $route,
//            ?array $routeArguments = null,
//            ?array $queryParams = null,
//            int $retainHash = Url::RETAIN_HASH
//        ): string => (new Url(webBase()))($route, $routeArguments, $queryParams, $retainHash),
//        'pagination'     => Pagination::class,
//    ],
    'exception_handler'   => ExceptionHandler::class,
    // install waglpz/webapp-security component and uncomment to enable firewall
    //'firewall'            => include 'firewall.php',
    'swagger_scheme_file' => __DIR__ . '/../swagger.json',
];
