FROM node:22-slim

WORKDIR /app

COPY . .

RUN npm install --only=production

CMD ["node", "app.js"]