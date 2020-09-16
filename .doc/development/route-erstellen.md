# Route für eine Aktion erstellen
 [< Zurück](../development.md)
## Route name und URL definieren

in Datei  `app/src/Routes.php` eine neue Route Definition erstellen in form:

Abstrakte Beispiel:

`public const ROUTE_NAME = '/route-url/{requiredPrameter:regEx}/[{optionalParm:regEx}]';`

Reallen Beispiel:

`public const LISTE_AUFTRAEGE = '/auftraege/{id:\d{1,11}/[{name:[a-zA-Z]}]';`

## Klass für Aktion erstellen (Controller) 
 Aktion Klassen werden in drei möglichen Varianten angelegt:
 - 1 Webanfrage eine ganz normale HTTP anfrage an MVC.
 - 2 RESTful Anfrage auf ein Endpoint mit JSON als Payload.
 - 3 CLI Console Anfrage zB. über Terminalfenster.

Aktion Klass für Webanfrage wird in `app/src/UI/Http/Web/` erstellt.

Aktion Klass für REST Anfrage wird in `app/src/UI/Http/Rest/` erstellt.

Aktion Klass für Cli wird in `app/src/UI/Http/Cli/` erstellt.


Aktion Klass sollte implementieren eine Methode: 
`abstract public function __invoke(ServerRequestInterface $request) : ResponseInterface;`

Aktion Klass kann erweitern `\Waglpz\Webapp\BaseController` (check composer requires "waglpz/webapp").
Wenn `BaseController` wurde erweitert dann Methode `render()` steht zur verfügung.
Diese ermöglicht eine korrespondierte Html Template zu rendern.

## Html Template erstellen

Template Dateien werden in Ordner `app/templates` gespeichert.
Namen Konvention soll beachtet werden. 
Template Datei soll genauso wie Aktion Klass genannt werden außer, 
dass die erste Buchstabe soll klein geschrieben werden.
   
zB. Aktion Klass heist: `SummaryList` und Template Datei wird `summaryList.phtml` genannt.

für spezielle Fälle Template Datei kann in Methode `render($data, $httpResponseStatus, $template)` gesetzt werden.
  
## Route für dispatching registrieren

In configuration Datei `app/config/router.php` eintrag in Form
`$router->get(Routes::ROUTE_NAME, AktionKlass::class);`
get, post und andren Shortcuts sind hier möglich. Anstelle man kann auch eine
Method `addRoute()` benutzen, auch Routen gruppieren ist möglich mit Methode `addGroup()`.

