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

COPY --from=builder --chown=docker:docker dist dist
COPY --from=builder --chown=docker:docker docs docs
COPY --from=builder node_modules node_modules
COPY  --chown=docker:docker tsconfig.src.json tsconfig.json
COPY entrypoint.sh entrypoint.sh

RUN adduser -u 2004 -D docker &&\
    chmod +x entrypoint.sh

WORKDIR /src

CMD [ "/entrypoint.sh" ]
