ARG NODE_IMAGE_VERSION=node:lts-alpine3.17

FROM $NODE_IMAGE_VERSION as builder

COPY . ./

RUN npm install --legacy-peer-deps --omit=dev &&\
    npm cache clean --force &&\
    npm run compile &&\
    npm test &&\
    npm run docs:generate

FROM $NODE_IMAGE_VERSION

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

CMD ["node", "--max-semi-space-size=64", "--max-old-space-size=2560", "--v8-pool-size=0", "--use-largepages=silent", "/dist/src/index.js"]
