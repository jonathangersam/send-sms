FROM node:boron

WORKDIR /usr/src/app

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
