FROM node:22-alpine

WORKDIR /srv/app

# Install dependencies needed for node-gyp and PostgreSQL
RUN apk add --no-cache python3 make g++ postgresql-client

# Copy package files first
COPY ./app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY ./app .

EXPOSE 1337

# Use a startup script to handle first-time setup
CMD ["sh", "-c", "npm run develop"]