FROM node:22.12.0-alpine

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Create the static-files directory and set permissions
RUN mkdir -p /static-files && chmod 777 /static-files

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

WORKDIR /app/dist

# Create PM2 configuration
RUN echo '{\
  "apps": [{\
    "name": "dz-artisan",\
    "script": "main.js",\
    "instances": 1,\
    "autorestart": true,\
    "watch": false,\
    "max_memory_restart": "1G"\
  }]\
}' > ecosystem.config.json

EXPOSE 3000

# Start with PM2
CMD ["pm2-runtime", "ecosystem.config.json"]