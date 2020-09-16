FROM mariadb:10.3.22

COPY config-file.cnf /etc/mysql/conf.d/
COPY init/01-databases.sql /docker-entrypoint-initdb.d/
COPY init/02-schema.sql /docker-entrypoint-initdb.d/
