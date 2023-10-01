FROM node:18-alpine

WORKDIR /app

COPY crypto-eval/package.json .

RUN npm install

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

COPY crypto-eval .