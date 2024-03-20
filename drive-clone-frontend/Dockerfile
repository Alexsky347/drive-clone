FROM node:20.11.0-alpine3.19 AS builder
LABEL authors="ald"
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy remaining frontend files
COPY ../../drive-clone-frontend .

# Build the React app for production (adjust script name if different)
RUN npm run build

# Final image stage
FROM nginx:alpine

# Copy built frontend artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Serve the built React app using nginx
CMD ["nginx", "-g", "daemon off;"]
