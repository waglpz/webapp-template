#!/usr/bin/env bash

# Ansi color code variables
RED="\e[0;91m"
BLUE="\e[0;94m"
EXPAND_BG="\e[K"
BLUE_BG="\e[0;104m${expand_bg}"
RED_BG="\e[0;101m${expand_bg}"
GREEN_BG="\e[0;102m${expand_bg}"
GREEN="\e[0;92m"
WHITE="\e[0;97m"
BOLD="\e[1m"
ULINE="\e[4m"
RESET="\e[0m"

if  [[ $(docker ps -q) != "" ]]; then
    echo
    echo
    echo -e "${RED}Hinweis:${RESET} ${GREEN}Docker Services sind gerade online (Up)${RESET}"
    echo
    docker ps
    docker ps -aq | xargs docker stop
    docker ps -aq | xargs docker rm -f
    docker network prune -f
    echo
    echo
    echo -e "${RED}Hinweis:${RESET} ${GREEN}Docker Services sind gestoppt${RESET}"
fi 

echo
echo -e "${RED}Hinweis:${RESET} Bei der Vergabe von Ports in folgenden Schritten, bitte keine Ports verwenden, die bereits in anderen Projekten verwendet sind!"
read -p "Drücken Sie eine beliebige Taste, um fortzufahren, oder <STRG+C> um abzubrechen"
echo
echo
echo -e "${RED}Hinweis:${RESET} Wenn Sie später eine Fehler sehen 'ERROR: ... Cannot start service ... driver failed programming external connectivity on endpoint'."
echo  "Das bedeutet Sie haben ein falschen Port genommen. Installation soll wiederholt werden mit anderen Ports."

read -p "Drücken Sie eine beliebige Taste, um fortzufahren, oder <STRG+C> um abzubrechen"

DBPORT=
while [[ $DBPORT = "" ]]; do
  read -p "$(echo -e ${GREEN}Geben Sie Port für Datenbank Server an: ${RESET})" -r DBPORT
done
echo "${DBPORT}"

APPPORT=
while [[ $APPPORT = "" ]]; do
  read -p "$(echo -e ${GREEN}Geben Sie Port für HTTP Apache Server an: ${RESET})" -r APPPORT
done
echo "${APPPORT}"

echo -e "${GREEN}Creating .env file in project root directory${RESET}"
printf "APPUID=%d\nAPPUGID=%d\nDBPORT=%d\nAPPPORT=%d\n" \
$(id -u)    \
$(id -g)    \
"$DBPORT"   \
"$APPPORT"  \
> .env

docker compose build --parallel --force-rm --no-cache --pull
echo -e "${GREEN}Finish build images${RESET}"
docker images | grep "$(basename $PWD)"
docker compose up -d
docker compose exec -u $(id -u):$(id -g) app composer install
