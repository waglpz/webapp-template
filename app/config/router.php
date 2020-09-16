<?php

declare(strict_types=1);

use @PROJECT_NS@\Routes;
use @PROJECT_NS@\UI\Http\Web\Index;
use FastRoute\RouteCollector;
use Waglpz\Webapp\UI\Http\Rest\Ping;
use Waglpz\Webapp\UI\Http\Web\SwaggerUI;

return static function (RouteCollector $router): void {
    $router->get(Routes::INDEX, Index::class);

    $router->addGroup(
        '/api',
        static function (RouteCollector $routeCollector): void {
            $routeCollector->get('/ping', Ping::class);
            $routeCollector->get('/doc', SwaggerUI::class);
            $routeCollector->get('/doc.json', SwaggerUI::class);
        }
    );
};
