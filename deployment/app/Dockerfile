FROM node:16-slim

USER node
WORKDIR /home/node
RUN mkdir -p ./app/client/dist ./app/server
COPY --chown=node:node ./client/dist ./app/client/dist

COPY --chown=node:node ./server ./app/server
COPY --chown=node:node ./public ./app/public
COPY --chown=node:node ./upload ./app/upload
WORKDIR /home/node/app/server
RUN npm install


WORKDIR /home/node/app/server
CMD ["./node_modules/@babel/node/bin/babel-node.js", "src/index.js"]