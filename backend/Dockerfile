# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the application port
EXPOSE 3000

# Run the NestJS application in development mode
CMD ["npm", "run", "start:dev"]
