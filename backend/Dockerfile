FROM node:20-slim

WORKDIR /app

# Install prisma dependencies
RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
