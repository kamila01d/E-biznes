# Use official NGINX image from DockerHub
FROM nginx:alpine

# Remove default NGINX configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom NGINX configuration file
COPY openai_frontend/nginx.conf /etc/nginx/conf.d/

# Copy your static files into the NGINX default serving directory
COPY /openai_frontend /usr/share/nginx/html

# Expose port 8080 instead of port 80
EXPOSE 8080

# Start NGINX in the foreground (necessary for Docker)
CMD ["nginx", "-g", "daemon off;"]
