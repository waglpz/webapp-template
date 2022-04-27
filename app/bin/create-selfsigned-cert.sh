#!/usr/bin/env bash

openssl req -x509 -newkey rsa:2048 -nodes -days 7300 \
 -keyout ../.docker/etc/ssl/selfsigned/selfsigned.key \
 -out ../.docker/etc/ssl/selfsigned/selfsigned.crt \
 -config selfsigned.conf \
 -batch
