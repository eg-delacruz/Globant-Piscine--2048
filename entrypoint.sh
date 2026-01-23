#!/bin/sh
set -e

echo "Starting entrypoint script..."
echo "PORT environment variable: ${PORT}"

# Set default PORT if not provided
PORT=${PORT:-80}
export PORT

echo "Using PORT: ${PORT}"

# Replace ${PORT} placeholder in the nginx config template and write to tmp
echo "Generating nginx configuration..."
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /tmp/default.conf

echo "Generated config:"
cat /tmp/default.conf

echo "Starting nginx..."
exec nginx -g 'daemon off;' -c /tmp/nginx.conf
