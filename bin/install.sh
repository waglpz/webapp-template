#!/usr/bin/env bash

# ANSI color code variables
R="\e[0;91m"
B="\e[0;94m"
EXPAND_BG="\e[K"
B_BG="\e[0;104m${EXPAND_BG}"
R_BG="\e[0;101m${EXPAND_BG}"
G_BG="\e[0;102m${EXPAND_BG}"
G="\e[0;92m"
W="\e[0;97m"
BOLD="\e[1m"
ULINE="\e[4m"
RST="\e[0m"
CANCEL_PROMPT="    press any key to continue or <Ctrl+C> to cancel"

clear

NAME=@PROJECT_NAME@

echo "Install and setting up certificate HTTPS"

sudo apt update && sudo apt install libnss3-tools

wget https://dl.filippo.io/mkcert/latest?for=linux/amd64 -O mkcert
sudo mv mkcert /usr/local/bin/
sudo chmod +x /usr/local/bin/mkcert
mkcert -install

mkcert -cert-file selfsigned.crt -key-file selfsigned.key ${NAME}-app.com ${NAME}-web.com

echo "HTTPS enabled."
read -p "    press any key to continue..."

git init
echo -e "${G}Git repository initiated via git init command.${RST}"

if [[ "$(/usr/bin/docker ps -q)" != "" ]]; then
    echo
    echo
    echo -e "All docker containers will be shut down...${RST}"
    read -p "${CANCEL_PROMPT}"
    echo
    docker ps -aq | xargs docker stop
    docker ps -aq | xargs docker rm -f
    docker network prune -f
    echo -e "${G}Done${RST}"
fi

echo

DBPORT=""
while [[ -z "$DBPORT" ]]; do
  read -p "Please enter the server port for the Database (db): " -r DBPORT
  if [[ "$DBPORT" -lt 1025 ]]; then
    DBPORT=""
    echo -e "${R}The port cannot be less than:${RST} 1025"
  fi
done
echo -e "${G}Database (db) port:${RST} ${DBPORT}"
echo

#APPPORT=""
#while [[ -z "$APPPORT" ]]; do
#  read -p "Please enter the server port for PHP backend (app): " -r APPPORT
#  if [[ "$APPPORT" -lt 1025 ]]; then
#    APPPORT=""
#    echo -e "${R}The port cannot be less than:${RST} 1025"
#  elif [[ "$APPPORT" == "$DBPORT" ]]; then
#    APPPORT=""
#    echo -e "${R}The backend server port cannot be the same as the database server port.${RST}"
#  fi
#done
#echo -e "${G}PHP backend (app) port:${RST} ${APPPORT}"
#echo

#WEBPORT=""
#while [[ -z "$WEBPORT" ]]; do
#  read -p "Please enter the server port for the frontend (web): " -r WEBPORT
#  if [[ "$WEBPORT" -lt 1025 ]]; then
#    WEBPORT=""
#    echo -e "${R}The port cannot be less than:${RST} 1025"
#  elif [[ "$WEBPORT" == "$DBPORT" ]]; then
#    WEBPORT=""
#    echo -e "${R}The port cannot be the same as the database server port.${RST}"
#  elif [[ "$WEBPORT" == "$APPPORT" ]]; then
#    WEBPORT=""
#    echo -e "${R}The port cannot be the same as the backend app server port.${RST}"
#  fi
#done
#echo -e "${G}Frontend (web) port:${RST} ${WEBPORT}"

echo "Creating Docker Compose environment file (.env) in project root directory"
read -p "    press any key to continue..."

cat << EOF > .env
APP_NAME=${NAME}
APPUID=$(id -u)
APPUGID=$(id -g)
DBPORT=${DBPORT}
WEBAPP_ID=
GOOGLECLIENTID=
ACCESS_TOKEN_PAPI_CLIENT=
AUTH_TOKEN_AWARE_URL=
EOF

echo -e "${G}Docker Compose environment file created with the content:${RST}"
cat .env

echo
read -p "Press any key to build docker images..."

docker compose build --force-rm --no-cache --pull
echo -e "${G}Finished building the images.${RST}"
docker images | grep "$(basename "$PWD")"
docker compose up -d

echo
read -p "Press any key to continue with setting up the web app type..."

find ./app -type f -name "composer.*" -exec "basename" {} \;  \
  | xargs sh -c 'echo List applcations:; for i in $0 $@; do echo $i | sed s/composer.json./"  "/; done';

APP_TYPE=""
while [[ -z "$APP_TYPE" ]]; do
  read -p "Please enter one of the listed types: " -r APP_TYPE
  if [[ ! -f "app/composer.json.$APP_TYPE" ]]; then
    APP_TYPE=""
    echo -e "${R}Unknown type entered:${RST} $APP_TYPE"
  fi
done

echo -e "${G}Web app type:${RST} ${APP_TYPE}"
echo

echo "Enabling the composer.json in the backend app stack: ${APP_TYPE}"
read -p "    press any key to continue..."
cp "app/composer.json.$APP_TYPE" app/composer.json
rm -f app/composer.json.*

echo -e "${G}Setup backend application type done${RST}"
echo

echo "Install backend app packages from composer file."
read -p "Press any key to continue"
docker compose exec -u "$(id -u)":"$(id -g)" app composer install
echo -e "${G}Packages installation done${RST}"
echo

read -p "Setup server names with IP mapping in /etc/hosts"

sudo su -c 'echo "## '"${NAME}"'" >> /etc/hosts && cat docker-compose.yml | grep "/etc/hosts" -A 15 | grep -v "/etc/hosts" | awk "NF" | sed -e "s/# //" >> /etc/hosts'

tail -n15 /etc/hosts
rm -rv bin

cat << EOF > README.md
# Projekt ${NAME}

### Kurze Beschreibung

... todo

### Verwendeter Technologie-Stack

- **$(docker -v)**
- **$(docker compose version)**
- **$(docker compose exec app php -v | head -n1) (in Docker)**
- **$(docker compose exec db mysql -uroot -proot -sse "SELECT VERSION();")**

### Technische Verantwortliche

- Alexander Hutorezki <alexander.hutorezki@gmail.com>

EOF

git add . && git commit -m "chore: Webapp code basis initial commit" > /dev/null

echo -e "${G_BG}${G}All is done. Finito:)${RST}"
