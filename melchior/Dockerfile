FROM node:16.16.0

WORKDIR /melchior

COPY package*.json ./

ENV NODE_ENV development

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "yarn", "serve" ]
