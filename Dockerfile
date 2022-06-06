ARG NODE_IMAGE_VERSION=16.13.0-alpine

FROM node:$NODE_IMAGE_VERSION as builder

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run compile
RUN npm test
RUN npm run generateDocs

FROM node:$NODE_IMAGE_VERSION

COPY --from=builder dist dist
COPY --from=builder package.json ./
COPY --from=builder package-lock.json ./
COPY --from=builder docs docs

RUN npm install --legacy-peer-deps --production

# Removing this plugin because it gets loaded by prettier and forces a fixed order for imports
RUN rm -rf /package.json /package-lock.json /node_modules/prettier-plugin-organize-imports

RUN adduser -u 2004 -D docker
RUN chown -R docker:docker /docs

WORKDIR /src

CMD ["node", "/dist/src/index.js"]
