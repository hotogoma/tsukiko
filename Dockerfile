FROM node:alpine

RUN apk --update add git

ENV PORT 80
EXPOSE 80

WORKDIR /bot
ADD . /bot
RUN npm install && mv node_modules /

CMD ["npm", "start"]
