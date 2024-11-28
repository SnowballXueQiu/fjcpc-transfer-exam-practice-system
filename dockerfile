# === Base Stage for Frontend and Backend ===
FROM node:23-alpine AS base
WORKDIR /app

# === Backend Builder ===
FROM base AS backend-builder
WORKDIR /backend
COPY ./package.json ./package-lock.json ./
RUN npm i npm-run-all
RUN npm install
COPY ./ ./
RUN npm run build

# === Production Runner ===
FROM node:23-alpine AS runner
WORKDIR /app

# Prepare directories for frontend and backend
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/frontend /app/backend

# Copy backend build files and necessary files (package.json, etc.)
COPY --from=backend-builder /backend/dist /app/backend
COPY --from=backend-builder /backend/package.json /app/backend

# Set up environment variables for production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install backend production dependencies
WORKDIR /app/backend
RUN npm install

# Copy frontend files and build it on container start (optional)
COPY ./frontend /app/frontend
WORKDIR /app/frontend
RUN npm i npm-run-all
RUN npm install
RUN npm run build

# Set permissions for non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port for backend
EXPOSE 3000

# Command to run the backend server (assume backend handles frontend assets)
CMD ["node", "dist/main.js"]
