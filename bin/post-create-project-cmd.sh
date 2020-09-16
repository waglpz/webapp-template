#!/usr/bin/env bash

NAME=$(echo $(basename "$PWD") | tr '[:upper:]' '[:lower:]');
#NS=$(echo "$NAME" | sed -e "s/[_ ]/-/g" | sed -e "s/-*\(\b.\)/\U\1/g")
NS=$(php -r "echo str_replace('-', '', ucwords(preg_replace('/[\.\+_\-\s]/', '-', '"$NAME"'), '-'));")
echo "Project name: $NAME"
echo "Namespace PHP classes: $NS"
echo "Docker Network Subnet: $NEXT_S_NET"

sed -ri -e 's!@S_NET@!'"$NEXT_S_NET"'!g' ./docker-compose.yml
sed -ri -e 's!@S_NET@!'"$NEXT_S_NET"'!g' .doc/development.md
find . -type f -exec sed -ri -e 's!@PROJECT_NS@!'"$NS"'!g' "{}" \;

find . -type f -exec sed -ri -e 's!@PROJECT_NAME@!'"$NAME"'!g' "{}" \;

rm -rv bin/post-create-project-cmd.sh composer.json

echo
echo "Please go to $(basename "$PWD") and"
echo "run bash bin/install.sh to complete installation."
echo
