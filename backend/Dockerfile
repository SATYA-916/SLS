FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies in production mode
RUN npm ci --omit=dev

# Copy source code
COPY src ./src

# Expose backend port
EXPOSE 3001

# Set production environment
ENV NODE_ENV=production
ENV PORT=3001

# Run API server
CMD ["node", "src/index.js"]
