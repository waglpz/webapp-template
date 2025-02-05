### STAGE Basis ###
FROM node:lts AS base

WORKDIR /web

### STAGE Development ###
FROM base AS dev

ENV PATH /web/node_modules/.bin:$PATH

EXPOSE 3000
CMD ["sleep", "100000"]

### STAGE Build ###
FROM base AS build

COPY web/package.json web/package-lock.json ./

RUN npm ci

COPY web ./

# Build-time ARGs
ARG REACT_APP_ENV_NAME=PROD
ARG REACT_APP_AUTH_TOKEN_URL=https://authz-provider.it-vwd.de/api/token
ARG REACT_APP_WEBAPP_ID=9fe1230e-9003-4bd6-a1fc-803fd17163eb
ARG REACT_APP_API_URL=https://citest.it-vwd.de/api
ARG REACT_APP_NAME='Reference Project Webapp (Test)'
ARG REACT_APP_GOOGLECLIENTID=GOOGLECLIENTID-xxx-abc-123

# Pass ARGs to ENV (make them available at runtime)
ENV REACT_APP_VERSION=$npm_package_version \
    REACT_APP_ENV_NAME=$REACT_APP_ENV_NAME \
    REACT_APP_AUTH_TOKEN_URL=$REACT_APP_AUTH_TOKEN_URL \
    REACT_APP_WEBAPP_ID=$REACT_APP_WEBAPP_ID \
    REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_NAME=$REACT_APP_NAME \
    REACT_APP_GOOGLECLIENTID=$REACT_APP_GOOGLECLIENTID

RUN npm run build --omit=dev

### STAGE prod ###
FROM nginx:alpine AS prod

COPY --from=build /web/build /usr/share/nginx/html/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
