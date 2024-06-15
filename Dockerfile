FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY tsconfig.json ./


CMD if [ "$NODE_ENV" = "production" ]; then npm run compile && node build/main.js; else npm run dev; fi
