# Anleitung zur Verwendung von mkcert auf Ubuntu

Diese Anleitung soll Ihnen dabei helfen, mkcert auf Ubuntu zu installieren und zu verwenden, um lokale,
vertrauenswürdige SSL-Zertifikate zu erstellen.

## Einleitung

[mkcert](https://github.com/FiloSottile/mkcert) ist ein einfaches Tool zur Erstellung lokaler, vertrauenswürdiger
SSL-Zertifikate. Es ist nützlich für Entwickler, die HTTPS für lokale Entwicklungsumgebungen einrichten möchten, ohne
sich mit komplizierten Zertifikatsverwaltungsprozessen herumschlagen zu müssen.

## Installation von mkcert

1. **Aktualisieren Sie die Paketliste:**

    ```sh
    sudo apt update
    ```

2. **Installieren Sie die erforderlichen Abhängigkeiten:**

    ```sh
    sudo apt install libnss3-tools
    ```

3. **Laden Sie mkcert herunter und installieren Sie es:**

    ```sh
    wget https://dl.filippo.io/mkcert/latest?for=linux/amd64 -O mkcert
    sudo mv mkcert /usr/local/bin/
    sudo chmod +x /usr/local/bin/mkcert
    ```

4. **Installieren Sie die lokale CA (Certificate Authority):**

    ```sh
    mkcert -install
    ```

## Erstellung von Zertifikaten

1. **Wechseln Sie in das Verzeichnis, in dem Sie die Zertifikate speichern möchten:**

    ```sh
    cd /path/to/your/project
    ```

2. **Erstellen Sie Zertifikate für mehrere Domains (z.B. `ci-api.com` und `ci-web.com`):**

    ```sh
    mkcert -cert-file selfsigned.crt -key-file selfsigned.key ci-api.com ci-web.com
    ```

   Dadurch werden zwei Dateien erstellt:
    - `selfsigned.crt` (das Zertifikat)
    - `selfsigned.key` (der private Schlüssel)

## Verwendung der Zertifikate

Nachdem Docker hochgefahren ist, sind alle notwendigen Konfigurationen abgeschlossen und der Browser meldet keine
unsichere Verbindung mehr.

Je nach Ihrem lokalen Webserver müssen Sie die erstellten Zertifikate in die Konfigurationsdateien des Servers
einbinden. Dies sollte in Ihrem aktuellen Projekt bereits erledigt sein.

### Beispiel: Verwendung mit Nginx

Falls Sie eine zusätzliche Konfiguration für Nginx benötigen, hier ein Beispiel:

1. **Bearbeiten Sie Ihre Nginx-Konfigurationsdatei (z.B. `/etc/nginx/sites-available/default`):**

    ```sh
    sudo nano /etc/nginx/sites-available/default
    ```

2. **Fügen Sie die SSL-Parameter hinzu:**

    ```nginx
    server {
        listen 443 ssl;
        server_name ci-api.com ci-web.com;

        ssl_certificate /path/to/your/project/selfsigned.crt;
        ssl_certificate_key /path/to/your/project/selfsigned.key;

        # Weitere Konfigurationen...
    }
    ```

3. **Starten Sie Nginx neu, um die Änderungen zu übernehmen:**

    ```sh
    sudo systemctl restart nginx
    ```

## Fehlerbehebung

- **Zertifikat wird nicht als vertrauenswürdig erkannt:** Stellen Sie sicher, dass Sie `mkcert -install` ausgeführt
  haben, um die lokale CA zu installieren.
- **Probleme mit bestimmten Browsern:** Einige Browser wie Firefox verwenden eigene Zertifikatspeicher. Stellen Sie
  sicher, dass die CA auch dort installiert ist.

## Weitere Informationen

Weitere Informationen und fortgeschrittene Nutzungsmöglichkeiten finden Sie in der
offiziellen [mkcert-Dokumentation](https://github.com/FiloSottile/mkcert).
