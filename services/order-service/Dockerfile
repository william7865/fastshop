FROM node:25-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

EXPOSE 3002
CMD ["npm", "run", "start"]
