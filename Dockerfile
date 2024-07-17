FROM node:20.15.1-slim

WORKDIR /app

COPY . /app/

RUN npm install

CMD ["npm", "start"]