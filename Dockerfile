# Use the official Node.js 20 image for Windows
# Electron 26 runs on Node 20, and this base provides the necessary runtime
# for building and running the app in a Windows container.
FROM node:20-windowsservercore-ltsc2022

# Create and set working directory
WORKDIR /app

# Install dependencies defined in package-lock.json
COPY package*.json ./
RUN npm ci --no-optional

# Copy the rest of the application source
COPY . .

# Default command launches the Electron app
CMD ["npm", "start"]
