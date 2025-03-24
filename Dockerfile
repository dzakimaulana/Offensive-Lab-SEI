FROM node:18-slim
WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY package*json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]