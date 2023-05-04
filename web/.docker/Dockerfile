### STAGE Basis ###
FROM node:16.17.1 as base

RUN mkdir /web
WORKDIR /web

ENV PATH /web/node_modules/.bin:$PATH

### STAGE Development ###
FROM base as dev

EXPOSE 3000
CMD ["sleep", "100000"]

FROM base as build
COPY package.json /web/package.json

RUN npm install

COPY . /web

RUN npm run build

### NGINX ###
FROM nginx:stable-alpine

COPY --from=build /web/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
