# Stage 1
FROM node:22-alpine AS build-stage

WORKDIR /frontend

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Stage 2
FROM nginx

COPY --from=build-stage /frontend/build /usr/share/nginx/html

COPY config/nginx.conf /etc/nginx/conf.d/default.conf

CMD nginx -g 'daemon off;'