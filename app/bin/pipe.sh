#! /usr/bin/env bash
pipe=../var/pipe
trap "rm -f $pipe" EXIT
[ -p "$pipe" ] || mkfifo -m 0600 "$pipe" || exit 1
while :; do
    while read -r cmd; do
        if [ "$cmd" ]; then
            printf 'Running %s ...\n' "$cmd"
            sh -c "$cmd" sh
        fi
    done <"$pipe"
done
