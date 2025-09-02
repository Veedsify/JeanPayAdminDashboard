# Use the official Bun image as the base
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and bun.lockb to install dependencies
COPY package.json bun.lockb ./

# Install project dependencies
RUN bun install

# Copy the rest of your application code
COPY . .

# Build the application
RUN bun run build

# Expose the port your application listens on (if applicable)
EXPOSE 3001

# Command to run your application
CMD ["bun", "run", "start"]