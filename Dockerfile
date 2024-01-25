FROM node:lts-alpine3.19 as builder

COPY src ./src
COPY docs ./docs
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install --legacy-peer-deps --omit=dev &&\
    npm cache clean --force &&\
    npm run build:docs &&\
    npm run test

FROM node:lts-alpine3.19

COPY --from=builder dist ./dist
COPY --from=builder docs ./docs 
COPY --from=builder node_modules ./node_modules
COPY tsconfig.src.json /tsconfig.json

RUN adduser -u 2004 -D docker &&\
    chown -R docker:docker /dist /docs /tsconfig.json &&\
    chmod -R 555 /dist /docs /tsconfig.json

WORKDIR /src

CMD ["node", "--max-semi-space-size=64", "--max-old-space-size=2560", "--v8-pool-size=0", "--use-largepages=silent", "/dist/src/index.js"]
