# -------- Builder stage: install ALL deps (incl. dev) and compile TS --------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (dev + prod) to be able to run the TypeScript build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# Ensure there is a build script in package.json: "build": "tsc -p tsconfig.json"
RUN npm run build

# -------- Runtime stage: only production deps and compiled output --------
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Install ONLY production dependencies for a slimmer image
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled code and any runtime assets
COPY --from=builder /app/dist ./dist
# If you need other files at runtime (e.g., prisma schema, public assets, healthcheck.js), copy them explicitly:
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/healthcheck.js ./healthcheck.js

# Drop privileges to a non-root user provided by the Node image
USER node

EXPOSE 3000

# Health check (uncomment if you have this file in the image)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node healthcheck.js || exit 1

# Start your app (expects "start" to run compiled JS, e.g., node dist/index.js)
CMD ["npm", "start"]