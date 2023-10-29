#!/bin/bash

echo 'Starting build_project script'

source scripts/init.sh
source scripts/package.sh

docker compose down

# Phase 1
#docker compose up -d frontend
#docker compose up certbot
#docker compose down
#
## some configurations for let's encrypt
#curl -L --create-dirs -o etc/letsencrypt/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
#openssl dhparam -out etc/letsencrypt/ssl-dhparams.pem 2048

# Phase 2
#crontab ./etc/crontab
docker compose up -d


# publish docker image and increment tag
source scripts/publish.sh my_image 1.0 my-registry

echo 'Build_project script finished'