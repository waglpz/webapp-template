FROM waglpz/vwd-base:8.2

ARG APPUID=0
ARG APPUGID=0
ARG DUSER=www-data

ENV COMPOSER_HOME /var/www/composer

RUN if [ ${APPUID} != 0 -a $(getent passwd ${DUSER}) ]; then \
        userdel -f ${DUSER};                \
        if getent group ${DUSER} ; then     \
            groupdel ${DUSER};              \
        fi;                                 \
        groupadd -g ${APPUGID} ${DUSER};    \
        useradd -r -l -u ${APPUID} -g ${DUSER} ${DUSER}; \
        chown -R ${DUSER}:${DUSER} $COMPOSER_HOME;       \
    fi

COPY etc/ssl/selfsigned/selfsigned.crt /etc/ssl/certs
COPY etc/ssl/selfsigned/selfsigned.key /etc/ssl/private


ENV APACHE_DOCUMENT_ROOT /app/public
RUN echo ${APACHE_DOCUMENT_ROOT}
RUN a2enmod rewrite         \
    && a2enmod headers      \
    && a2enmod ssl          \
    && a2ensite default-ssl \
    && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && sed -i '/SSLCertificateFile.*snakeoil\.pem/c\SSLCertificateFile \/etc\/ssl\/certs\/selfsigned.crt' /etc/apache2/sites-available/default-ssl.conf \
    && sed -i '/SSLCertificateKeyFile.*snakeoil\.key/cSSLCertificateKeyFile /etc/ssl/private/selfsigned.key\' /etc/apache2/sites-available/default-ssl.conf


WORKDIR /app
