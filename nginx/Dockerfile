FROM nginx:stable-alpine

# Copy frontend files and make them accesible to nginx
RUN mkdir /www
COPY ./build /www
RUN chown nginx:nginx -R /www
RUN chmod -R 0755 /www

# Copy nginx configuration
COPY ./nginx/villas.conf /etc/nginx/conf.d/default.conf
