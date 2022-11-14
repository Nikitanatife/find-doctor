FROM node:18

WORKDIR /app

COPY package*.json ./

RUN export $(cat .env) && npm install

COPY . .

EXPOSE $PORT

CMD export $(cat .env) && npm start
