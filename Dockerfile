FROM node:10
WORKDIR /usr/src/app

# install node_modules in docker
COPY package*.json ./
RUN npm install

# copy source on docker
COPY src/models/ ./models/
COPY src/app.ts ./
COPY .env ./

EXPOSE 3001

CMD [ "ts-node", "app.ts" ]