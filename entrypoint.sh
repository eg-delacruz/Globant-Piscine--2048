#!/bin/sh
# Replace ${PORT} placeholder in the nginx config template
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
