#!/usr/bin/env bash

# Ansi color code variables
YELLOW="\e[1;33m"
RED="\e[0;91m"
BLUE="\e[0;94m"
GREEN="\e[0;92m"
WHITE="\e[0;97m"
RESET="\e[0m"

NAME=$(echo $(basename "$PWD") | tr '[:upper:]' '[:lower:]');
NS=$(php -r "echo str_replace('-', '', ucwords(preg_replace('/[\.\+_\-\s]/', '-', '"$NAME"'), '-'));")
echo
echo -e ${RED}Project initialization...
echo -e ${BLUE}Project name: ${YELLOW}${NAME}
echo -e ${BLUE}Namespace PHP classes: ${YELLOW}${NS}${RESET}
echo -e ${BLUE}Docker Network Subnet: ${YELLOW}${NEXT_S_NET}

sed -ri -e 's!@S_NET@!'"$NEXT_S_NET"'!g' ./docker-compose.yml
sed -ri -e 's!@S_NET@!'"$NEXT_S_NET"'!g' .doc/development.md
find . -type f -exec sed -ri -e 's!@PROJECT_NS@!'"$NS"'!g' "{}" \;
find . -type f -exec sed -ri -e 's!@PROJECT_NAME@!'"$NAME"'!g' "{}" \;
rm -rv bin/post-create-project-cmd.sh composer.json

echo
echo -e ${RED}Next steps you need to do are:
echo -e "${WHITE}  "cd $(basename "$PWD")
echo -e ${BLUE}then run
echo -e "${WHITE}  "bash bin/install.sh
echo
echo -e ${GREEN}to complete this installation put next line
echo -e ${WHITE}
tail -n2 ${PWD}/docker-compose.yml
echo
echo -e ${GREEN}into ${YELLOW}/etc/hosts${RESET}
echo -e "${GREEN}pls don't forget to uncomment them ;)"
echo
