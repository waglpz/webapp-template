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

NAME="@PROJECT_NAME@"

echo "Install and setting up certificate HTTPS"

if ! command -v mkcert &> /dev/null; then
    echo -e "${R}mkcert could not be found. Installing...${RST}"
    sudo apt update && sudo apt install -y libnss3-tools
    wget https://dl.filippo.io/mkcert/latest?for=linux/amd64 -O mkcert
    sudo mv mkcert /usr/local/bin/
    sudo chmod +x /usr/local/bin/mkcert
fi

mkcert -install

mkcert -cert-file selfsigned.crt -key-file selfsigned.key "${NAME}-app.com" "${NAME}-web.com"

echo "HTTPS enabled."
read -p "${CANCEL_PROMPT}"

git init
echo -e "${G}Git repository initiated via git init command.${RST}"

if [[ -n "$(docker ps -q)" ]]; then
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
  if ! [[ "$DBPORT" =~ ^[0-9]+$ ]] || [[ "$DBPORT" -lt 1025 ]]; then
    DBPORT=""
    echo -e "${R}The port must be a number and cannot be less than:${RST} 1025"
  fi
done
echo -e "${G}Database (db) port:${RST} ${DBPORT}"
echo

echo "Creating Docker Compose environment file (.env) in project root directory"
read -p "${CANCEL_PROMPT}"

cat << EOF > .env
APP_NAME=${NAME}
APPUID=$(id -u)
APPUGID=$(id -g)
DBPORT=${DBPORT}
WEBAPP_ID=$(uuidgen -r)

# google console
GOOGLECLIENTID=

# gitlab access token
ACCESS_TOKEN_PAPI_CLIENT=

# auth-z provider url
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
read -p "${CANCEL_PROMPT}"
cp "app/composer.json.$APP_TYPE" app/composer.json
rm -f app/composer.json.*

if [[ $APP_TYPE == "rest" || $APP_TYPE == "webapp.full" ]]; then
  cat << EOF > app/var/public.pem
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnHjZO1TutlhOuf2Yr2az
EMKiraFPrWrxHPCWx2w8JKBPDD0/Y/0Y/vDi26xbnPavi7qfi9mplAwhqRW331Yw
+2q/EOT9jj+s2Mgc+3vX4ojGiPOkRG5tVIOo+pni1col4V+HZGHC2yC5htYWRHvV
ddU7KdyhiC6xTQopUZW3bIFtAmSXceh8R0cpcddtfbNMIb21UvW9HKlk4V09Y0Hu
wyGXagPjiedZP3HSzCmIylxLteQhfGn9vJfs0o53D87KlvwLDXhYpX9k1FPk1PH3
kHaN3RbeUI1fECfkn2/sOUhdwZ5mSgt78w5EoWgxOTqyEDOdJjW9N6lc2quGn6L0
hwIDAQAB
-----END PUBLIC KEY-----
EOF
  echo "JWT_PUBLIC_RSA_KEY_FILE=/app/var/public.pem" >> app/.env.dist
fi

echo -e "${G}Setup backend application type done${RST}"
echo

echo "Install backend app packages from composer file."
read -p "Press any key to continue"
docker compose exec -u "$(id -u)":"$(id -g)" app composer install
echo -e "${G}Packages installation done${RST}"
echo

echo "Setup server names with IP mapping in /etc/hosts"
read -p "Press any key to continue"

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

if [[ $APP_TYPE == "rest" ]]; then
  echo "All final steps described in: file://$(realpath .doc/development/final-setup-webapp-restapi.md)"
fi

echo -e "${G_BG}${G}All is done. Finito:)${RST}"
