#!/usr/bin/env bash

openssl req -x509 -newkey rsa:2048 -nodes -days 7300 \
 -keyout ../selfsigned.key \
 -out ../selfsigned.crt \
 -config selfsigned.config \
 -batch
