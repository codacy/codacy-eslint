FROM node:lts-alpine3.19 as builder

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps --omit=dev &&\
    npm cache clean --force

COPY src src
COPY docs docs
COPY tsconfig.json ./

RUN npm run build:docs &&\
    npm run test

FROM node:lts-alpine3.19

COPY --from=builder dist dist
COPY --from=builder docs docs
COPY --from=builder node_modules node_modules
COPY tsconfig.src.json tsconfig.json
COPY entrypoint.sh entrypoint.sh

RUN adduser -u 2004 -D docker &&\
    chown -R docker:docker dist docs tsconfig.json &&\
    chmod +x entrypoint.sh

WORKDIR /src

#CMD ["node", "--optimize_for_size", "--gc_interval=100", "--max-old-space-size=2560", "/dist/src/index.js"]
CMD [ "/entrypoint.sh" ]
