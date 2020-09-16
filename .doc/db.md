## Database Documentation

* [Docker](docker.md)
* [Development](development.md)
* [Production](production.md)
* [Database](db.md)
* [App](app.md)

Connecting to database server
`mysql -u@PROJECT_NAME@ -ppassword -h@PROJECT_NAME@-db`

Development Operations

**_(!) Hint:_** Always recreate DB base image when database data in docker container should renew. 
Eg schema should be updated. 
To achieve this one please execute follow commands 
from project directory which is contains docker-compose.yml file.

### Stop docker stack

```bash
docker-compose down
```

### delete database image

```bash
docker rmi $(basename $PWD)_db
```

### delete existing data volume

```bash
docker volume rm $(basename $PWD)_db-data
```

### add/update new stuf, and recompile the image

```bash
docker-compose build --parallel --force-rm --no-cache --pull db
```

### start docker stack

```bash
docker-compose up -d
```

