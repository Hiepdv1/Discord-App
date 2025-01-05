############################### 
# BUILD STAGE 
############################### 
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies including WebRTC requirements
RUN apk add --no-cache \
    make \
    g++ \
    python3 \
    libtool \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    jpeg-dev \
    libwebp-dev \
    vips-dev \
    # WebRTC specific dependencies
    libstdc++ \
    libgcc \
    opus \
    openssl

# Copy package files
COPY package*.json ./

# Install dependencies including WebRTC
RUN npm ci --omit=dev --unsafe-perm
RUN npm install wrtc@latest

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

############################### 
# DEVELOPMENT STAGE 
############################### 
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Install development dependencies including WebRTC requirements
RUN apk add --no-cache \
    libstdc++ \
    libgcc

COPY --from=build /usr/src/app /usr/src/app

# Install all dependencies
RUN npm ci --unsafe-perm

# Add non-root user
USER node

# Expose WebRTC ports
EXPOSE 3001
EXPOSE 443
EXPOSE 80


# Development command
CMD ["npm", "run", "start:dev"]

############################### 
# PRODUCTION STAGE 
############################### 
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install production dependencies including WebRTC requirements
RUN apk add --no-cache \
    libstdc++ \
    libgcc \
    opus \
    openssl

# Copy only necessary files
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV=production

# Add non-root user
USER node

# Expose WebRTC ports
EXPOSE 3001
EXPOSE 443
EXPOSE 80

# Production command
CMD ["node", "dist/main.js"]