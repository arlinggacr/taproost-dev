# ------------------ Builder Stage ------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build


# ------------------ Runner Stage ------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only what's needed for runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Set environment variables
EXPOSE 8080

# Start the app
CMD ["npm", "run", "start"]


# ------------------ Bun Alternative (commented out) ------------------
# FROM oven/bun:1.1.0 AS builder
# WORKDIR /app
# COPY package.json bun.lockb ./
# RUN bun install
# COPY . .
# RUN bun run build
#
# FROM oven/bun:1.1.0 AS runner
# WORKDIR /app
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/bun.lockb ./
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# ENV NODE_ENV=production
# ENV PORT=8080
# EXPOSE 8080
# CMD ["bun", "run", "start:prod"]
