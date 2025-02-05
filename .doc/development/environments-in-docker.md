# Frontend

1. **Lokale Entwicklung mit Docker:**
    - Für die lokale Entwicklung verwenden wir eine `.env`-Datei.
    - Jeder Entwickler kann eigene spezifische Environment-Werte verwenden mit der erstellung eines `.env.local` -Datei,
      diese darf nicht ins Git-Repository.
    - Der Docker-Container nutzt keine speziellen `ENV`- oder `ARG`-Direktiven im Dockerfile oder docker-compose.yml,
      sondern greift direkt auf die `web/.env`-Datei zu.
    - Es gibt eine separate `dev`-Stage im `web/Dockerfile`, die keine Umgebungsvariablen verwendet.

# Backend

1. **Lokale Entwicklung mit Docker:**
    - Für die lokale Entwicklung verwenden wir eine `.env.dist`-Datei. Diese wird automatisch eingelesen und zur
      Laufzeit von PHP Anwendung interpretiert.
    - Jeder Entwickler kann eigene spezifische Environment-Werte verwenden mit der erstellung eines `.env` -Datei,
      diese darf nicht ins Git-Repository.
    - Der Docker-Container nutzt keine speziellen `ENV`- oder `ARG`-Direktiven im Dockerfile oder docker-compose.yml,
      sondern greift direkt auf die `app/.env.dist`-Datei zu.
    - Es gibt eine separate `base`-Stage im `app/Dockerfile`, die keine Umgebungsvariablen verwendet.

# Datenbank


1. **Lokale Entwicklung mit Docker:**
   - Für die lokale Entwicklung verwenden wir Dockerimage auf Basis von `/.docker/db/Dockerfile`-Datei.
   - Der Docker-Container nutzt keine speziellen `ENV`- oder `ARG`-Direktiven im Dockerfile oder docker-compose.yml.
