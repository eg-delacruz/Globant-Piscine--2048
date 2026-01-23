#!/bin/sh
sed -i "s/listen 80/listen ${PORT:-80}/g" /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
