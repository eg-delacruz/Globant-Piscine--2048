FROM nginx:1.28.1-alpine

# Remove default Nginx assets so only our files are served
RUN rm -rf /usr/share/nginx/html/*

# Copy site content with non-root ownership to reduce permissions needed at runtime
COPY --chown=nginx:nginx . /usr/share/nginx/html

# Copy nginx config files
COPY --chown=nginx:nginx nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY --chown=nginx:nginx nginx.main.conf /tmp/nginx.conf

# Prepare writable runtime dirs and align nginx paths for non-root
RUN mkdir -p /var/cache/nginx /var/run/nginx /etc/nginx/conf.d \
    && chown -R nginx:nginx /var/cache/nginx /var/run/nginx /etc/nginx/conf.d /usr/share/nginx/html /tmp \
    && chmod -R 755 /tmp

# Copy entrypoint script
COPY --chown=nginx:nginx entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Drop privileges after setup
USER nginx

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80

EXPOSE 80