ARG NODE_IMAGE_VERSION=lts-alpine3.18

FROM node:$NODE_IMAGE_VERSION as builder

COPY package*.json ./
RUN npm install --legacy-peer-deps --omit=dev &&\
    npm cache clean --force

COPY . .

RUN npm run compile &&\
    npm test &&\
    npm run generateDocs

FROM node:$NODE_IMAGE_VERSION

COPY --from=builder dist dist
COPY --from=builder docs docs
COPY --from=builder package.json ./
COPY --from=builder package-lock.json ./
COPY --from=builder tsconfig.src.json ./tsconfig.json

RUN npm install --legacy-peer-deps --omit=dev &&\
    npm cache clean --force &&\
    rm -rf /package.json /package-lock.json &&\
    adduser -u 2004 -D docker &&\
    chown -R docker:docker /docs

WORKDIR /src

CMD ["node", "--max-semi-space-size=64", "--max-old-space-size=2304", "--v8-pool-size=0", "--use-largepages=silent", "/dist/src/index.js"]
