FROM waglpz/vwd-base:7.4

ARG APPUID=0
ARG APPUGID=0

# we setup an user id and group id identiclay to user on host
# and don't run in permission troubles
RUN if [ ${APPUID} != 0 -a $(getent passwd www-data) ]; then \
        userdel -f www-data;                \
        if getent group www-data ; then     \
            groupdel www-data;              \
        fi;                                 \
        groupadd -g ${APPUGID} www-data;    \
        useradd -r -l -u ${APPUID} -g www-data www-data; \
    fi;
