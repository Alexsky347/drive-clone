FROM node:20.8.1-alpine3.18 AS builder

WORKDIR /app

COPY package.json package.json

RUN npm i --verbose

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY --from=builder /app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]