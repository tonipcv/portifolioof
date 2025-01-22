FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"] 