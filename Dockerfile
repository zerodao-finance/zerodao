FROM alpine:latest
RUN apk add --no-cache supervisor nodejs npm redis git libstdc++ gcompat icu-data-full
RUN mkdir -p /var/log/supervisor
WORKDIR /app
RUN npm install -g yarn
COPY yarn.lock .
COPY packages packages
COPY package.json .
RUN yarn 2> /dev/null
COPY supervisord.conf .
CMD ["/usr/bin/supervisord", "-c", "/app/supervisord.conf"]
