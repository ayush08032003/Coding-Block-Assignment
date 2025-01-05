FROM node:18-alpine AS builder

WORKDIR /build

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies in the builder stage
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the project
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

# Copy package.json and package-lock.json from the builder stage
COPY --from=builder /build/package*.json ./

# Install dependencies in the runner stage (without copying node_modules)
RUN npm install --production

# Copy built files from the builder stage
COPY --from=builder /build/dist ./dist

EXPOSE 4053

CMD ["node", "dist/server.js"]
