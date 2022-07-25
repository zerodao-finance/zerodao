FROM node:lts
WORKDIR /app
COPY . .
RUN yarn
CMD ["yarn", "workspace", "@zerodao/watcher", "start"]
