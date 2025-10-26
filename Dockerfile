# ------------------ Builder Stage ------------------
# Use official Bun image to build the app
FROM oven/bun:1.1.0 AS builder

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install

COPY . .

RUN bun run build


# ------------------ Runner Stage ------------------
FROM oven/bun:1.1.0 AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV PORT=8080
EXPOSE 8080

# HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
#   CMD curl -f http://localhost:$PORT/ || exit 1

CMD ["bun", "run", "start"]
