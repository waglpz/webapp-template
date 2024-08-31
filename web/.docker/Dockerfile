### STAGE Basis ###
FROM node:lts AS base

RUN mkdir /web
WORKDIR /web

ENV PATH /web/node_modules/.bin:$PATH

### STAGE Development ###
FROM base AS dev

EXPOSE 3000
CMD ["sleep", "100000"]

FROM base AS build

COPY web/package.json web/package-lock.json ./

RUN npm ci

COPY web ./

RUN npm run build

### NGINX ###
### command to create image
### docker build --target=prod -f web/.docker/Dockerfile  . -t authz-provider-web
FROM nginx AS prod

COPY web/build /usr/share/nginx/html/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
