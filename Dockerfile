# Use Node.js 22
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install system dependencies for native module compilation
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set Python environment variable for node-gyp
ENV PYTHON=/usr/bin/python3

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies with npm
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3001

# Set default environment variable
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
