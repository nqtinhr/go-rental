FROM node:22-alpine

WORKDIR /backend

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 4000

CMD [ "node", "dist/app.js" ]
