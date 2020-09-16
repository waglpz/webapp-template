## Projekt @PROJECT_NAME@ 

* [Dokumentation](.doc/app.md)

### Kurze Beschreibung

How to first start using docker (docker should be already installed on your system, see [Docker installation](.doc/docker.md))
```bash
docker run --rm --interactive --tty     \
               -e NEXT_S_NET=$(( $(docker network ls -q | wc -l) + 1 )) \
               --volume $PWD:/app       \
               --user $(id -u):$(id -g) \
               composer create-project  \
                --ignore-platform-reqs  \
                --prefer-dist           \
                -s dev                  \
                --no-install            \
waglpz/webapp-template PROJECT_DIR
```
### Hilfe Punkte zum Entwicklung

* [wie erstelle ich eine Route](.doc/development/route-erstellen.md)

### Verwendete Tech-Stack

PHP ab 7.4

MariaDb ab 10.3

Swagger 3.0
 
### Technischer verantwortlicher 

Max Mustermann <a@b.cd>

