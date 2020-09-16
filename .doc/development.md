# Development Documentation

* [Docker](docker.md)
* [Development](development.md)
  * [wie erstelle ich eine Route](development/route-erstellen.md) 
  * [Browser Einstellungen](development/chrome-settings.md) 
* [Production](production.md)
* [Database](db.md)
* [App](app.md)

### setup DNS entry local
please add next in /etc/hosts

10.120.@S_NET@.2 @PROJECT_NAME@-app
10.120.@S_NET@.3 @PROJECT_NAME@-db

### working with docker

###### Log in PHP container as a normal user

```bash
docker-compose exec --user $(id -u):$(id -g) app bash
```

###### Log in PHP container as root user
```bash
docker-compose exec --user 0:0 app bash
```
