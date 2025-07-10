# Use official Node LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the backend port from .env
EXPOSE 8001

# Start the server using nodemon or node
CMD ["npm", "start"]