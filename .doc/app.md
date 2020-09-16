## Application documentation

* [Docker](docker.md)
* [Development](development.md)
* [Production](production.md)
* [Database](db.md)
* [App](app.md)

#### Install in Docker Container

```bash
docker-compose exec -u $(id -u):$(id -g) app composer install
```

#### Check application
```bash
docker-compose exec -u $(id -u):$(id -g) app composer check
```

#### Test Project Code health with composer check
###### log in container
```bash
docker-compose exec -u $(id -u):$(id -g) app bash
```

##### all checks at once
`composer check`

##### run check only once at a time

###### only code style check
`composer cs-check`

###### code style fixing
`composer cs-fix`

###### code static type check
`composer analyse`

###### run automated tests
`composer test`
