#!/bin/bash

#GENERAL
NETWORK_NAME=drive-nt
DOMAIN=ledainalexis.com
EMAIL=ledain.alexis@gmail.com
PROTOCOL=http

#DB
DB_USER_USERNAME=admin
DB_USER_PASSWORD=admin
DB_CONTAINER_NAME=db
DB_NAME=drive-clone
DB_PORT=8906
DB_HOST=localhost

#BACK
SERVER_PORT=8080
DRIVE_USER_USERNAME=alex6
DRIVE_USER_EMAIL=test@gmail.com
DRIVE_USER_PWD=`openssl rand -hex 10`
LOG_LEVEL=INFO
LOG_LEVEL_SECURITY=WARN

#FRONT
FRONTEND_PORT=3000


#clear file
env_bk_file_path="../.env"
echo > $env_bk_file_path
echo "NETWORK_NAME=${NETWORK_NAME}" >> "$env_bk_file_path"
echo "DOMAIN=${DOMAIN}" >> "$env_bk_file_path"
echo "EMAIL=${EMAIL}" >> "$env_bk_file_path"
echo "DB_USER_USERNAME=${DB_USER_USERNAME}" >> "$env_bk_file_path"
echo "DB_USER_PASSWORD=${DB_USER_PASSWORD}" >> "$env_bk_file_path"
echo "DB_NAME=${DB_NAME}" >> "$env_bk_file_path"
echo "DB_PORT=${DB_PORT}" >> "$env_bk_file_path"
echo "SERVER_PORT=${SERVER_PORT}" >> "$env_bk_file_path"
echo "DRIVE_USER_USERNAME=${DRIVE_USER_USERNAME}" >> "$env_bk_file_path"
echo "DRIVE_USER_EMAIL=${DRIVE_USER_EMAIL}" >> "$env_bk_file_path"
echo "DRIVE_USER_PWD=${DRIVE_USER_PWD}" >> "$env_bk_file_path"
echo "FRONTEND_PORT=${FRONTEND_PORT}" >> "$env_bk_file_path"
echo "ALLOWED_HOST=${PROTOCOL}://${DOMAIN}:${FRONTEND_PORT}" >> "$env_bk_file_path"
echo "NODE_ENV=production" >> "$env_bk_file_path"

env_fr_file_path="../drive-clone-frontend/.env"
echo > $env_fr_file_path
echo REACT_APP_BACKEND_URL=http://localhost/api >> $env_fr_file_path
