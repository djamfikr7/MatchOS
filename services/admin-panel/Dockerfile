FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port Vite runs on
EXPOSE 3006

# Start in development mode with host exposure
CMD ["npm", "run", "dev", "--", "--host"]
