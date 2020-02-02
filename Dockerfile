FROM node:10
WORKDIR /usr/src/app

# install node_modules in docker
COPY package*.json ./
RUN npm install

# copy source on docker
COPY models/ ./models/
COPY .env ./
COPY app.js ./

EXPOSE 3001

CMD [ "node", "app.js" ]