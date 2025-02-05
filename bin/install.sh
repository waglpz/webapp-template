#!/usr/bin/env bash

# ANSI color code variables
R="\e[0;91m"    # Red
B="\e[0;94m"    # Blue
EXPAND_BG="\e[K" # Clear to end of line
B_BG="\e[0;104m${EXPAND_BG}" # Light Blue Background
R_BG="\e[0;101m${EXPAND_BG}" # Red Background
G_BG="\e[0;102m${EXPAND_BG}" # Green Background
G="\e[0;92m"    # Green
W="\e[0;97m"    # White
PINK="\e[1;35m" # Bright Magenta (Pink)
BOLD="\e[1m"    # Bold
ULINE="\e[4m"   # Underline
RST="\e[0m"     # Reset
CANCEL_PROMPT="    Press any key to continue or <Ctrl+C> to cancel"

clear

NAME="@PROJECT_NAME@"

echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Install and set up HTTPS certificate                         │
└──────────────────────────────────────────────────────────────┘
"

# Function to install mkcert if not present
install_mkcert() {
    if ! command -v mkcert &> /dev/null; then
        echo -e "${R}mkcert program could not be found. Installing...${RST}"
        sudo apt update && sudo apt install -y libnss3-tools
        wget -q https://dl.filippo.io/mkcert/latest?for=linux/amd64 -O mkcert
        sudo mv mkcert /usr/local/bin/
        sudo chmod +x /usr/local/bin/mkcert
    fi
}

install_mkcert

mkcert -install
mkcert -cert-file selfsigned.crt -key-file selfsigned.key "${NAME}-app.com" "${NAME}-web.com"

echo -e "${G}HTTPS enabled.${RST}"
read -p "${CANCEL_PROMPT}"

echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Initialize Git repository                                    │
└──────────────────────────────────────────────────────────────┘
"
git init
echo -e "${G}Git repository initiated.${RST}"

echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Stop running Docker containers                               │
└──────────────────────────────────────────────────────────────┘
"
if [[ -n "$(docker ps -q)" ]]; then
    echo -e "${R}All running docker containers will be shutting down...${RST}"
    read -p "${CANCEL_PROMPT}"
    docker ps -aq | xargs docker stop
    docker ps -aq | xargs docker rm -f
    docker network prune -f
    echo -e "${G}...shutting down done${RST}"
fi

echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Set database server port for docker container                │
└──────────────────────────────────────────────────────────────┘
"
DBPORT=""
while [[ -z "$DBPORT" ]]; do
  read -p "Please enter the port for the database server (db container): " -r DBPORT
  if ! [[ "$DBPORT" =~ ^[0-9]+$ ]] || [[ "$DBPORT" -lt 1025 ]]; then
    DBPORT=""
    echo -e "${R}The port must be a number and cannot be less than 1025.${RST}"
  fi
done

echo -e "${G}Database (db) port:${RST} ${DBPORT}"

# Create Docker Compose environment file
echo " "
echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Next step will create Docker Compose environment file (.env) │
│ in project root directory.                                   │
│ Note:                                                        │
│  - app manages own environment via app/.env.dist file        │
│  - web manages own environment via web/.env file             │
└──────────────────────────────────────────────────────────────┘
"
read -p "${CANCEL_PROMPT}"

cat << EOF > .env
# Specifies the name of the application. This will be used throughout the project for identification and configuration.
APP_NAME=${NAME}

# Captures the user ID of the current user executing the script. This is useful for permission in docker.
APPUID=$(id -u)

# Captures the group ID of the current user executing the script. Similar to APPUID, it helps in managing docker permissions.
APPUGID=$(id -g)

# Specifies the port on which the database server will listen for connections. This must be set to avoid conflicts with other running servers.
DBPORT=${DBPORT}

# Generated a UUID for the web application instance. This must integrated on AuthZ-Provider Webpage.
WEBAPP_ID=$(uuidgen -r)

# This variable is intended to hold the client ID for Google Cloud Console. See https://console.cloud.google.com/auth/clients.
GOOGLECLIENTID=

# This variable is for storing the access token, needed to authenticate with the Personal API.
ACCESS_TOKEN_PAPI_CLIENT=

# This variable holds the URL for the authentication token provider (AuthZ-Provider). It is necessary for obtaining authorization tokens for secured endpoints.
AUTH_TOKEN_AWARE_URL=https://xxxxxxxxx/token
EOF

echo -e "${G}Docker Compose environment file created with the content:${RST}"
cat .env

read -p "${CANCEL_PROMPT}"

echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Build Docker images app, web, db, ...                        │
└──────────────────────────────────────────────────────────────┘
"
echo
read -p "Press any key to build Docker images..."
docker compose build --force-rm --no-cache --pull
echo -e "${G}...building images done.${RST}"
docker images | grep "$(basename "$PWD")"
docker compose up -d

echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Choose application type                                      │
└──────────────────────────────────────────────────────────────┘
"
declare -A APP_DESCRIPTIONS
APP_DESCRIPTIONS=(
    ["minimal"]="A minimal stack for quick prototyping of applications. It includes a basic set of components and modules."
    ["cli"]="A Command-Line Application designed to facilitate the execution of CLI scripts efficiently."
    ["rest"]="A backend service providing a REST API for interaction with external clients, such as a React frontend."
    ["webapp"]="A traditional web application that runs all components on a single backend, utilizing Bootstrap, jQuery, and the MVC pattern."
    ["webapp.full"]="An integrated solution combining CLI, REST, and MVC into a comprehensive application."
)

read -p "Press any key to continue with setting up the application type..."
echo
echo "Available application kinds:"

for APP_TYPE in "${!APP_DESCRIPTIONS[@]}"; do
    echo -e "${APP_DESCRIPTIONS[$APP_TYPE]}"
    echo
    echo -e "${BOLD}${APP_TYPE}${RST}"
    echo
done

APP_TYPE=""
while [[ -z "$APP_TYPE" ]]; do
  read -p "Please enter one of the listed types: " -r APP_TYPE
  if [[ ! -v APP_DESCRIPTIONS["$APP_TYPE"] || ! -f "app/composer.json.$APP_TYPE" ]]; then
    APP_TYPE=""
    echo -e "${R}Unknown type entered:${RST} $APP_TYPE"
  fi
done

echo
echo -e "${G}You selected:${RST} ${BOLD}${APP_TYPE}${RST}"
echo

# Enable the composer.json for the selected app type
echo "Enabling the composer.json in the backend app stack: ${APP_TYPE}"
read -p "${CANCEL_PROMPT}"
cp "app/composer.json.$APP_TYPE" app/composer.json
rm -f app/composer.json.*

# If the selected type is REST or full web app, create a public key
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

echo -e "${G}Setup kind of backend application done${RST}"
echo

echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Install backend app packages from composer file              │
└──────────────────────────────────────────────────────────────┘
"
read -p "Press any key to continue"
docker compose exec -u "$(id -u)":"$(id -g)" app composer install
echo -e "${G}Packages installation done${RST}"

if [[ $APP_TYPE != "cli" ]]; then
echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Install frontend web packages from package file              │
└──────────────────────────────────────────────────────────────┘
"
read -p "Press any key to continue"
docker compose exec -u "$(id -u)":"$(id -g)" web npm install
echo -e "${G}Packages installation done${RST}"
fi

if [[ $APP_TYPE == "rest" || $APP_TYPE == "webapp.full" || $APP_TYPE == "webapp"  ]]; then
echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Setup server names with IP mapping in /etc/hosts             │
└──────────────────────────────────────────────────────────────┘
"
read -p "Press any key to continue"
sudo su -c 'echo "## '"${NAME}"'" >> /etc/hosts && cat docker-compose.yml | grep "/etc/hosts" -A 15 | grep -v "/etc/hosts" | awk "NF" | sed -e "s/# //" >> /etc/hosts'

tail -n15 /etc/hosts
fi

rm -rv bin

echo -e "
┌──────────────────────────────────────────────────────────────┐
│ Create README file                                           │
└──────────────────────────────────────────────────────────────┘
"
cat << EOF > README.md
# Projekt ${NAME}

### Kurze Beschreibung

... todo

### Technology Stack

- **$(docker -v)**
- **$(docker compose version)**
- **$(docker compose exec app php -v | head -n1) (in Docker)**
- **$(docker compose exec db mysql -uroot -proot -sse "SELECT VERSION();")**

### Technical Contact

- Alexander Hutorezki <alexander.hutorezki@gmail.com>

EOF

git add . && git commit -m "chore: Webapp code base initial commit" > /dev/null

if [[ $APP_TYPE == "rest" || $APP_TYPE == "webapp.full" || $APP_TYPE == "webapp"  ]]; then
  echo -e "${PINK}All final steps described in:${RST} ${ULINE}file://$(realpath .doc/development/final-setup-webapp-restapi.md)${RST}"
fi

echo -e "${G_BG}${G}All is done. Finito:)${RST}"
