FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

RUN mkdir /init && chown mssql /init

COPY entrypoint.sh /

RUN chmod +x /entrypoint.sh

USER mssql

CMD /bin/bash /entrypoint.sh
