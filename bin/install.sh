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
INFO="🔔"
OK="🎉"
ALLERT="🚨"
WARN="⚠️ "
CANCEL_PROMPT="    ${WARN} Drücken Sie eine beliebige Taste, um fortzufahren oder <Strg+C>, um abzubrechen."
clear

NAME="abc"
APP_TYPE=""

echo -e "
┌──────────────────────────────────────────────────────────────────────────────┐
│                         🚀 Projekt Setup-Assistent                           │
│                                                                              │
│       🔹 Willkommen zum automatisierten Setup-Skript für Dein Projekt!       │
│                                                                              │
│ Dieses Skript hilft Dir dabei, die benötigte Umgebung schnell und einfach    │
│ einzurichten.                                                                │
│ Es übernimmt folgende Schritte für dich:                                     │
│                                                                              │
│ 🎯 Am Ende des Setups wird dein Projekt fast vollständig konfiguriert sein,  │
│    und du kannst direkt mit der Entwicklung starten! 🚀                      │
└──────────────────────────────────────────────────────────────────────────────┘
"
read -p "${CANCEL_PROMPT}"
clear


# Function to install mkcert if not present
install_mkcert() {
    if ! command -v mkcert &> /dev/null; then
        echo -e "${R}
        ${WARN} mkcert program could not be found. Installing...${RST}
        "
        sudo apt update && sudo apt install -y libnss3-tools
        wget -q https://dl.filippo.io/mkcert/latest?for=linux/amd64 -O mkcert
        sudo mv mkcert /usr/local/bin/
        sudo chmod +x /usr/local/bin/mkcert
    fi
}
setup_https() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Install and set up HTTPS certificate                         │
    └──────────────────────────────────────────────────────────────┘
    "

    install_mkcert
    mkcert -install
    mkcert -cert-file selfsigned.crt -key-file selfsigned.key "${NAME}-app.com" "${NAME}-web.com"
    echo -e "
    ${OK} ${G}HTTPS enabled.${RST}
    "
}
init_git() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Git-Repository initialisierung                               │
    └──────────────────────────────────────────────────────────────┘
    "
    git init
    echo -e "
    ${OK} ${G}Git-Repository wurde initialisiert.${RST}
    "
}
commit() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Code ins Git-Repository übertragen                           │
    └──────────────────────────────────────────────────────────────┘
    "

    git add . && git commit -m "chore: Initial commit core codebase" > /dev/null
    echo
    echo -e "
    ${OK} ${G}Der Initial-Commit der Kern-Codebasis ist abgeschlossen.${RST}
    "
    echo
    echo -e "
    ${INFO} ${G}Bitte nicht vergessen, das Git-Remote einzurichten!${RST}
    "
}
stop_active_docker() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Laufende Docker-Container stoppen                            │
    └──────────────────────────────────────────────────────────────┘
    "
    if [[ -n "$(docker ps -q)" ]]; then
    echo -e "
    ${WARN} ${R}Laufende Docker-Container werden heruntergefahren...${RST}
    "
    read -p "${CANCEL_PROMPT}"
    docker ps -aq | xargs docker stop
    docker ps -aq | xargs docker rm -f
    docker network prune -f
    echo -e "
    ${OK} ${G}...Herunterfahren abgeschlossen.${RST}
    "
    fi
}
set_db_port() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Datenbankserver-Port für den Docker-Container festlegen      │
    └──────────────────────────────────────────────────────────────┘
    "
    DBPORT=""
    while [[ -z "$DBPORT" ]]; do
      read -p "    Bitte geben Sie den Port für den Datenbankserver-Container ein, z. B. 4444: " -r DBPORT
      if ! [[ "$DBPORT" =~ ^[0-9]+$ ]] || [[ "$DBPORT" -lt 1025 ]]; then
      DBPORT=""
      echo -e "
      ${ALLERT} ${R}Der Port muss eine Zahl sein und darf nicht kleiner als 1025 sein.${RST}
      "
      fi
    done
    echo -e "
    ${OK} ${G}Datenbank (DB-Service) Port:${RST} ${DBPORT}
    "
}
create_env_file() {
    # Create Docker Compose environment file
    echo
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Der nächste Schritt erstellt die Docker-Compose-Umgebungsfile│
    │ im Projektstammverzeichnis (.env).                           │
    │ Hinweis:                                                     │
    │  - Die 'app' verwaltet ihre eigene Umgebung über die Datei   │
    │    app/.env.dist                                             │
    │  - Das Web-Frontend verwaltet seine eigene Umgebung          │
    │    über die Datei web/.env                                   │
    └──────────────────────────────────────────────────────────────┘
    "
    read -p "${CANCEL_PROMPT}"

    cat << EOF > .env
    # Gibt den Namen der Anwendung an.
    # Dieser wird im gesamten Projekt zur Identifikation und Konfiguration verwendet.
    APP_NAME=${NAME}
    # Erfasst die Benutzer-ID des aktuellen Nutzers, der das Skript ausführt.
    # Dies ist nützlich für Berechtigungen in Docker.
    APPUID=$(id -u)
    # Erfasst die Gruppen-ID des aktuellen Nutzers, der das Skript ausführt.
    # Ähnlich wie APPUID hilft sie bei der Verwaltung von Docker-Berechtigungen.
    APPUGID=$(id -g)
    # Legt den Port fest, auf dem der Datenbankserver auf Verbindungen hört.
    # Dies muss eingestellt werden, um Konflikte mit anderen laufenden Servern zu vermeiden.
    DBPORT=${DBPORT}
    # Erstellt eine UUID für die Webanwendungsinstanz.
    # Diese muss in die AuthZ-Provider-Webseite integriert werden.
    WEBAPP_ID=$(uuidgen -r)
    # Diese Variable ist für die Speicherung der Client-ID.
    # Siehe https://console.cloud.google.com/auth/clients.
    GOOGLECLIENTID=
    # Diese Variable dient zur Speicherung des Zugriffstokens,
    # das für die Authentifizierung mit der Personal API erforderlich ist.
    ACCESS_TOKEN_PAPI_CLIENT=
    # Diese Variable enthält die URL für den Authentifizierungs-Token-Anbieter
    # (AuthZ-Provider). Sie ist notwendig, um Autorisierungstoken für gesicherte Endpunkte zu erhalten.
    AUTH_TOKEN_AWARE_URL=https://authz-provider.x-x.de/api/token
EOF
    echo -e "
    ${OK} ${G}Die Datei für die Docker-Compose-Umgebung wurde mit folgendem Inhalt erstellt:${RST}
    "
    echo
    cat .env
    echo
}
build_docker_images() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Docker-Images für App, Web, DB, ... erstellen                │
    └──────────────────────────────────────────────────────────────┘
    "
    echo
    read -p "    Drücke eine beliebige Taste, um die Docker-Images zu erstellen..."
    docker compose build --force-rm --no-cache --pull
    clear
    echo -e "
    ${OK} ${G}Die Images wurden erfolgreich erstellt.${RST}
    "
    echo
    docker images | grep "$(basename "$PWD")"
    echo
}
run_docker_compose() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Docker-Container für das Projekt starten                     │
    └──────────────────────────────────────────────────────────────┘
    "
    docker compose up -d
    echo
}
init_backend() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Bitte wähle den Anwendungstyp.                               │
    └──────────────────────────────────────────────────────────────┘
    "
    declare -A APP_DESCRIPTIONS
    APP_DESCRIPTIONS=(
        ["minimal"]="Ein minimales Stack für schnelles Prototyping von Anwendungen. Es umfasst eine grundlegende Auswahl an Komponenten und Modulen."
        ["cli"]="Eine Kommandozeilenanwendung, die darauf ausgelegt ist, die Ausführung von CLI-Skripten effizient zu erleichtern."
        ["rest"]="Eine REST-API für die Interaktion mit externen Clients, wie z.B. einem React-Frontend, bereitstellt."
        ["webapp"]="Eine traditionelle Webanwendung, die alle Komponenten auf einem einzigen Backend ausführt und Bootstrap, jQuery und das MVC-Muster nutzt."
        ["webapp.full"]="Eine integrierte Lösung, die CLI, REST und MVC zu einer umfassenden Anwendung kombiniert."
    )

    echo
    echo -e "
    ${INFO} ${G}Verfügbare Anwendungsarten:${RST}
    "

    for _TYPE in "${!APP_DESCRIPTIONS[@]}"; do
        echo -e "
        ${BOLD}${G}${_TYPE}${RST}
        ${APP_DESCRIPTIONS[${_TYPE}]}
        "
    done

    while [[ -z "${APP_TYPE}" ]]; do
      read -p "    Bitte geben Sie einen der aufgeführten Typen ein: " -r APP_TYPE
      if [[ ! -v APP_DESCRIPTIONS["${APP_TYPE}"] || ! -f "app/composer.json.${APP_TYPE}" ]]; then
      APP_TYPE=""
      echo -e "
      ${ALLERT} ${R}Unbekannter Typ eingegeben:${RST} ${APP_TYPE}
      "
      fi
    done
    clear
    echo
    echo -e "
    ${OK} ${G}Ausgewählt:${RST} ${BOLD}${APP_TYPE}${RST}
    "
    echo
    cp "app/composer.json.${APP_TYPE}" app/composer.json
    rm -f app/composer.json.*

    # If the selected type is REST or full web app, create a public key
    if [[ "${APP_TYPE}" == "rest" || "${APP_TYPE}" == "webapp.full" ]]; then
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
}
install_composer_dependencies() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Backend-Pakete aus der Composer-Datei installieren           │
    └──────────────────────────────────────────────────────────────┘
    "
    read -p "${CANCEL_PROMPT}"
    docker compose exec -u "$(id -u)":"$(id -g)" app composer install
    clear
    echo -e "
    ${OK} ${G}Installation der Pakete abgeschlossen.${RST}
    "
    echo
}
install_node_packages_if_needed() {
    if [[ "${APP_TYPE}" != "cli" ]]; then
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ Frontend-Webpakete aus der Paketdatei installieren           │
    └──────────────────────────────────────────────────────────────┘
    "
    read -p "${CANCEL_PROMPT}"
    docker compose exec -u "$(id -u)":"$(id -g)" web npm install
    clear
    echo -e "
    ${OK} ${G}Installation der Frontend-Pakete abgeschlossen.${RST}
    "
    fi
    echo
}
create_readme() {
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ README.md-Datei erstellen                                    │
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
}
setup_docker_services_dns_resolve() {
    if [[ "${APP_TYPE}" == "rest" || "${APP_TYPE}" == "webapp.full" || "${APP_TYPE}" == "webapp"  ]]; then
    echo -e "
    ┌──────────────────────────────────────────────────────────────┐
    │ DNS-Auflösung in /etc/hosts einrichten. IP's zu Hostnamen    │
    └──────────────────────────────────────────────────────────────┘
    "
    read -p "${CANCEL_PROMPT}"
    sudo su -c 'echo "## '"${NAME}"'" >> /etc/hosts && cat docker-compose.yml | grep "/etc/hosts" -A 15 | grep -v "/etc/hosts" | awk "NF" | sed -e "s/# //" >> /etc/hosts'
    tail -n15 /etc/hosts
    fi
    echo
}
initial_steps() {
    setup_https
    read -p "${CANCEL_PROMPT}"
    clear

    init_git
    read -p "${CANCEL_PROMPT}"
    clear

    stop_active_docker
    read -p "${CANCEL_PROMPT}"
    clear

    set_db_port
    read -p "${CANCEL_PROMPT}"
    clear

    create_env_file
    read -p "${CANCEL_PROMPT}"
    clear

    build_docker_images
    read -p "${CANCEL_PROMPT}"
    clear

    run_docker_compose
    read -p "${CANCEL_PROMPT}"
    clear

    create_readme
    read -p "${CANCEL_PROMPT}"
    clear
}
backend() {
  init_backend
  read -p "${CANCEL_PROMPT}"
  clear

  install_composer_dependencies
  read -p "${CANCEL_PROMPT}"
  clear
}
frontend() {
  install_node_packages_if_needed
  read -p "${CANCEL_PROMPT}"
  clear
}
final_steps() {
    if [[ "${APP_TYPE}" == "rest" || "${APP_TYPE}" == "webapp.full" || "${APP_TYPE}" == "webapp"  ]]; then
      setup_docker_services_dns_resolve
      read -p "${CANCEL_PROMPT}"
      clear

      echo -e "
      ┌──────────────────────────────────────────────────────────────┐
      │ Abschluss-Schritte                                           │
      └──────────────────────────────────────────────────────────────┘
      "
      echo -e "
      ${INFO} ${G}Öffnen Sie die Datei mit den Informationen mit <STRG+Click>${RST}
      "
      echo
      echo -e "
      ${ULINE}file://$(realpath .doc/development/final-setup-webapp-restapi.md)${RST}
      "
      echo
    fi
}

initial_steps

backend

frontend

final_steps

rm -rf bin/instal.sh bin/php.inc bin/post-create-project-cmd.sh

read -p "${CANCEL_PROMPT}"
clear
echo
echo -e "${G_BG}${G}Alles erledigt. Fertig! Finito:)${RST}"
echo
