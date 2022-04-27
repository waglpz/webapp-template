# Docker Documentation

* [Docker](docker.md)
* [Development](development.md)
* [Production](production.md)
* [Database](db.md)
* [App](app.md)

## Installation

The project requires [Docker] and [Docker Compose] to be installed.
Please refer to the online documentation for installation instructions 
depending on your host OS.

Described is installation on Ubuntu

[Docker]: https://docs.docker.com/install/linux/docker-ce/ubuntu/
[Docker compose]: https://docs.docker.com/compose/install/

_(!) all commands run from project directory_

## Preparations before building images

To build the docker stack environment please run first (if this was not already done from composer post script) in project directory next command:

```bash
printf "APPUID=$(id -u)\nAPPUGID=$(id -g)\nDBPORT=3367\nAPPPORT=8081\n" > .env
```

After them setup necessary values of ports to be mapped into the host APP/DB accordingly to your needs.
Eg if on your host an Apache server running on port 80 then you should 
make a change in .env for eg `APPPORT=8081`. So will Apache from Docker not conflict with Apache on the host.


### Compiling all defined images
```bash
docker compose build --parallel --force-rm --no-cache --pull
```

### Start the environment
```bash
docker compose up -d
```

### Display docker stack environment state
```bash
docker compose ps
```

### Expose logs from running docker stack 
```bash
docker compose logs --tail 10 -f
```

## Working with the environment

Any commands can executed from within the container using shell, or by using docker compose exec.
To get a shell prompt inside of the APP container:
```bash
docker compose exec --user $(id -u):$(id -g) app bash
```

Example command to run from container shell or host:
```bash
php -v
# or
docker compose exec --user $(id -u):$(id -g) app php -v
```

## Accessing the environment components

There are few containers running in the current setup: APP (Apache, PHP), MariaDB.
The docker compose environment creates a network interface using the `10.120.5.0/24` subnet.
See the end of `docker compose.yml` for the entry in your local `hosts` 
file to access the containers by the domainname.

- [Web interface](http://@PROJECT_NAME@-app)
