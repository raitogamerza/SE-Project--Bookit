# Use specific Node version based on Alpine Linux for smaller size
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production || npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the API runs on
EXPOSE 5000

# Start the Node.js application
CMD ["node", "server.js"]
