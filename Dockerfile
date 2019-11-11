FROM node:13.1.0-alpine

COPY package*.json ./

# RUN npm install

COPY node_modules node_modules

COPY . .

RUN npm run compile

CMD ["node", "dist/index.js"]
