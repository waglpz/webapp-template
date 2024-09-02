Hier ist eine schrittweise Anleitung für die abschließende Schritte um Webapp Restapi einzurichten:

---

### Schritt 1: Aktualisieren der Hauptkonfigurationsdatei

#### Datei: `app/config/main.php`

**Beschreibung**: Aktivieren und konfigurieren Sie den Exception-Handler, die Firewall und andere wichtige Komponenten.

**Änderungen**:

- Aktivieren Sie die folgenden Konfigurationen durch das Entfernen der Kommentarzeichen:

    ```php
    'router'               => include 'router.php',
    'db'                   => include 'db.php',
    'view'                 => [
        'templates'  => \dirname(__DIR__) . '/templates/',
        'attributes' => ['webseitenTitle' => 'Testseite'],
        'layout'     => 'layout.phtml',
    ],
    'exception_handler'    => ExceptionHandler::class,
    'firewall'             => include 'firewall.php',
    'apiVersion'           => '0.1.0',
    'swagger_scheme_file'  => __DIR__ . '/../swagger.json',
    ```

---

### Schritt 2: Aktualisieren der Router-Konfiguration

#### Datei: `app/config/router.php`

**Beschreibung**: Entfernen Sie überflüssigen, auskommentierten Code und passen Sie die Routen für die REST-API-Komponente an.

**Änderungen**:

- Entfernen Sie die Kommentare um den Code für die Routenregistrierung.

    ```php
    $router->addGroup(
            '/api',
            static function (RouteCollector $routeCollector): void {
                $container  = \Waglpz\DiContainer\container();
                $middleware = $container->get(RouteCollectorForMiddleware::class);
                \assert($middleware instanceof RouteCollectorForMiddleware);
                $middleware->setContainer($container);
                $middleware->setWrappedRouteCollector($routeCollector);

                $routeCollector->get('/ping', Ping::class);
                $routeCollector->get('/doc', SwaggerUI::class);
                $routeCollector->get('/doc.json', SwaggerUI::class);

                if (\APP_ENV === 'dev') {
                    $currentRouterCollector = $routeCollector;
                    if (! $container->has('$DefaultAuthStorage')) {
                        throw new \Error('Container does not contains expected class ' . AuthStorage::class);
                    }

                    $authStorage = $container->get('$DefaultAuthStorage');
                    \assert($authStorage instanceof AuthStorage);
                    $authData = [
                        'roles' => ['ROLE_RW'],
                        'email' => 'developper+admin@gmail.com',
                    ];
                    $authStorage->assign($authData);
                } else {
                    $currentRouterCollector = $middleware;
                }
                //$currentRouterCollector->addRoute($httpMethod, $route, $handler);
            },
        );
    ```

---
