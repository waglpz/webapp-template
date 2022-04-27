#!/usr/bin/env bash

# Ansi color code variables
Y="\e[1;33m"
R="\e[0;91m"
B="\e[0;94m"
G="\e[0;92m"
W="\e[0;97m"
RST="\e[0m"
CANCEL_PROMT="    press any key to continue or <CTRL+C> to cancel"

clear
echo ""
echo New project initialization...

BASE_NAME=$(basename "$PWD")
NS=$(php ./bin/php.inc ns "${BASE_NAME}")
EX=$?

if [[ ${EX} -ne 0 ]]
then
  echo  -e "${R}Error occurs at parsing PHP Namespace string from given: ${BASE_NAME}. Exit status: ${EX}.${RST}";
  exit 1;
fi

if [[ -z "${NS}" ]]
then
  echo -e "${R}Error occurs at parsing PHP Namespace string from given: ${BASE_NAME}.${RST}" ;
  exit 1;
fi

NAME=$(php ./bin/php.inc slug "${BASE_NAME}")
EX=$?

if [[ ${NAME} -ne 0 ]]
then
  echo  -e "${R}Error occurs at parsing project name string from given: ${BASE_NAME}. Exit status: ${EX}.${RST}";
  exit 1;
fi


if [[ -z "${NAME}" ]]
then
  echo -e "${R}Error occurs at parsing project name from given: ${BASE_NAME}.${RST}";
  exit 1;
fi

echo ""
echo -e Project name will be: "${G}${NAME}${RST}".
read -p "${CANCEL_PROMT}"

echo -e PHP Namespace: "${G}${NS}${RST}".
read -p "${CANCEL_PROMT}"

if [[ -z "${NEXT_S_NET}" ]]
then
  read -p "Please set IP Address for docker compose network: " NEXT_S_NET
fi

sed -ri -e 's!@S_NET@!'"$NEXT_S_NET"'!g' ./docker-compose.yml
sed -ri -e 's!@S_NET@!'"$NEXT_S_NET"'!g' .doc/development.md

find . -type f -exec sed -ri -e 's!@PROJECT_NS@!'"$NS"'!g' "{}" \;
find . -type f -exec sed -ri -e 's!@PROJECT_NAME@!'"$NAME"'!g' "{}" \;

rm -rv $0 bin/php.inc composer.json
echo -e "${G}Setup complete.${RST}"
echo -e "Continue with installation"
read -p "${CANCEL_PROMT}"
echo -e "Please run command: ${Y}cd ${BASE_NAME} && bash bin/install.sh ${RST}"
