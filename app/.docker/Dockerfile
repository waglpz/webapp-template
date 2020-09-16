FROM olekhy/webapp

RUN apt-get update;                 \
    apt-get install                 \
            -y                      \
            --no-install-recommends \
        bash-completion             \
    ;                               \
    rm -rf /var/lib/apt/lists/*;    \
    rm -rf /var/cache/apt;          \
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false

ARG APPUID=0
ARG APPUGID=0

ENV COMPOSER_HOME /var/www/composer

RUN if [ ${APPUID} != 0 -a $(getent passwd www-data) ]; then \
        userdel -f www-data;                \
        if getent group www-data ; then     \
            groupdel www-data;              \
        fi;                                 \
        mkdir -p  /home/www-data;           \
        groupadd -g ${APPUGID} www-data;    \
        useradd -d /home/www-data -r -l -u ${APPUID} -g www-data www-data; \
    fi;

# composer
RUN chown -R www-data:www-data $COMPOSER_HOME

# bash completion for composer
ENV SHELL bash
RUN mkdir -p  /home/www-data
RUN composer global require bamarni/symfony-console-autocomplete
RUN $COMPOSER_HOME/vendor/bin/symfony-autocomplete composer | tee /etc/bash_completion.d/composer
RUN echo '$COMPOSER_HOME/vendor/bin/symfony-autocomplete composer > /etc/bash_completion.d/composer ; \
        . /etc/bash_completion.d/composer ; \
        . /etc/profile ;                    \
    ' >> /home/www-data/.bashrc

RUN chown -R www-data:www-data /etc/bash_completion.d
RUN chown -R www-data:www-data /home/www-data/.bashrc

# setup apache
ENV APACHE_DOCUMENT_ROOT /app/public
RUN a2enmod rewrite     \
    && a2enmod headers  \
    && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

