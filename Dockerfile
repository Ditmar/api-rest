FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache bash
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 1000000
COPY . .
RUN yarn build


EXPOSE 3000

CMD ["node", "./dist/App.js"]