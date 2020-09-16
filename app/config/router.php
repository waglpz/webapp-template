<?php

declare(strict_types=1);

use FastRoute\RouteCollector;
use Waglpz\Webapp\UI\Http\Rest\Ping;
use Waglpz\Webapp\UI\Http\Web\SwaggerUI;

return static function (RouteCollector $router): void {
    $router->get('/doc', SwaggerUI::class);
    $router->get('/doc.json', SwaggerUI::class);
    $router->addGroup(
        '/api',
        static function (RouteCollector $routeCollector): void {
            $routeCollector->get('/ping', Ping::class);
        }
    );
};
