#!/bin/sh
# Set default PORT if not provided
PORT=${PORT:-80}
export PORT

# Replace ${PORT} placeholder in the nginx config template and write to tmp
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /tmp/default.conf
exec nginx -g 'daemon off;' -c /tmp/nginx.conf
