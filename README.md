## Projekt @PROJECT_NAME@ 

* [Dokumentation](.doc/app.md)

### Kurze Beschreibung

How to first start using docker (docker should be already installed on your system, see [Docker installation](.doc/docker.md))

#### Fish
```fish
# on fish

docker run --rm --interactive \
  --tty -e NEXT_S_NET=(math (docker network ls -q | wc -l) + 1) \
  --volume $PWD:/app      \
  --user (id -u):(id -g)  \
  composer create-project \
  --ignore-platform-reqs  \
  --prefer-dist           \
  --no-install            \
waglpz/webapp-template PROJECT_NAME

```

#### Bash
```bash
# on bash
docker run --rm --interactive --tty \
  -e NEXT_S_NET=$(( $(docker network ls -q | wc -l) + 1 )) \
  --volume $PWD:/app       \
  --user $(id -u):$(id -g) \
  composer create-project  \
  --ignore-platform-reqs   \
  --prefer-dist            \
  --no-install             \
waglpz/webapp-template PROJECT_NAME

```
### Hilfe Punkte zum Entwicklung

* [wie erstelle ich eine Route](.doc/development/route-erstellen.md)

### Verwendeter Technologie-Stack

- **Docker version 27.2.0, build 3ab4256**
- **Docker Compose version v2.29.2**
- **PHP 8.3.4 (cli) (built: Apr  8 2024 22:31:17) (NTS) (in Docker)**
- **10.3.22-MariaDB-1:10.3.22+maria~bionic**

### Technischer verantwortlicher 

Max Mustermann <a@b.cd>
