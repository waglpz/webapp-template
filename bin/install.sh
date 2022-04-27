#!/usr/bin/env bash

# Ansi color code variables
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
CANCEL_PROMT="    press any key to continue or <CTRL+C> to cancel"

clear

if  [[ $(docker ps -q) != "" ]]; then
    echo
    echo
    echo -e "All docker services will be down...${RST}"
    read -p "${CANCEL_PROMT}"
    echo
    docker ps -aq | xargs docker stop
    docker ps -aq | xargs docker rm -f
    docker network prune -f
    echo -e "${G}done${RST}"
fi 

echo

DBPORT=
while [[ "${DBPORT}" = "" ]]; do
  read -p "Please enter the Port for Database service: " -r DBPORT
  if [[ "${DBPORT}" -lt 1025 ]]
  then
    DBPORT=
    echo -e "${R}The port cannot be less than:${RST} 1025"
  fi
done
echo -e "${G}Database server port:${RST} ${DBPORT}"

APPPORT=
while [[ "${APPPORT}" = "" ]]; do
  read -p "Please enter the Port for Web service: " -r APPPORT
  if [[ "${APPPORT}" -lt 1025 ]]
  then
    APPPORT=
    echo -e "${R}The port cannot be less than:${RST} 1025"
  fi
  if [[ "${APPPORT}" = "${DBPORT}" ]]
  then
    APPPORT=
    echo -e "${R}The web server port cannot be same as database server port.${RST}"
  fi
done
echo -e "${G}Webserver port:${RST} ${APPPORT}"

read -p "Creating Docker composer environment file .env in project root directory. Press any key to continue..."

printf "APPUID=%d\nAPPUGID=%d\nDBPORT=%d\nAPPPORT=%d\n" \
"$(id -u)"    \
"$(id -g)"    \
"$DBPORT"   \
"$APPPORT"  \
> .env

echo -e "${G}Docker composer environment file created with content:${RST}"
cat .env

echo ""
read -p "Press any key for continue with building docker images"

docker compose build --force-rm --no-cache --pull
echo -e "${G}Finish build images${RST}"
docker images | grep "$(basename $PWD)"
docker compose up -d

echo ""
read -p "Press any key for continue with setup application type"

find ./app -type f -name "composer.*" -exec "basename" {} \;  \
  | xargs sh -c 'echo List applcations:; for i in $0 $@; do echo $i | sed s/composer.json./"  "/; done';

APP_TYPE=
while [[ ${APP_TYPE} = "" ]]; do
  read -p "Please enter one of listed types: " -r APP_TYPE
  if [[ ! -f "app/composer.json.${APP_TYPE}" ]]
  then
    APP_TYPE=
    echo -e "${R}Bad application type selected:${RST} $APP_TYPE"
  fi
done
echo -e "${G}Application type selected:${RST} ${APP_TYPE}"
echo ""

read -p "Enable composer.json for given application: ${APP_TYPE}. Press any key to continue"
cp "app/composer.json.$APP_TYPE" app/composer.json
echo -e "${G}done${RST}"
echo ""

read -p "Install composer packages. Press any key to continue"
docker compose exec -u "$(id -u)":"$(id -g)" app composer install
echo -e "${G}done${RST}"
echo ""

read -p "Enable names to IP mapping in /etc/hosts"

sudo su -c 'echo "## '"${NAME}"'" >> /etc/hosts && cat docker-compose.yml | grep "/etc/hosts" -A 15 | grep -v "/etc/hosts" | awk "NF" | sed -e "s/# //" >> /etc/hosts'

tail -n15 /etc/hosts
rm -rv bin

echo -e "${G_BG}${G}All done Finito :)${RST}"
