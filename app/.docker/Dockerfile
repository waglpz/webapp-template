FROM waglpz/vwd-base:8.3-fpm AS base

FROM base AS build

#<editor-fold desc="Composer for PHP">
########################################################################################################################

ENV COMPOSER_HOME=/var/www/composer

RUN curl -sS https://getcomposer.org/installer |                \
       php -- --install-dir=/usr/local/bin --filename=composer  \
    && composer global require maglnet/composer-require-checker

RUN chown -R www-data:www-data $COMPOSER_HOME

COPY app /app

COPY app/var/public.pem /app/var/public.pem

RUN composer install --no-dev --optimize-autoloader

#</editor-fold>
#-----------------------------------------------------------------------------------------------------------------------


FROM scratch AS code

COPY --from=build /app /app
