# === Base Stage for Frontend and Backend ===
FROM node:23-alpine AS base
WORKDIR /app

# === Frontend Builder ===
FROM base AS frontend-builder
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install --omit=dev
# 安装 npm-run-all，以便能运行 run-p
RUN npm install npm-run-all --save-dev
COPY ./frontend ./
RUN npm run build

# === Backend Builder ===
FROM base AS backend-builder
WORKDIR /backend
COPY ./package.json ./package-lock.json ./
RUN npm install --omit=dev
COPY ./ ./
RUN npm run build

# === Production Runner ===
FROM node:23-alpine AS runner
WORKDIR /app

# Prepare directories for frontend and backend
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/frontend /app/backend

# Copy frontend build files
COPY --from=frontend-builder /frontend/dist /app/frontend

# Copy backend build files and necessary files (package.json, etc.)
COPY --from=backend-builder /backend/dist /app/backend
COPY --from=backend-builder /backend/package.json /app/backend

# Set up environment variables for production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install backend production dependencies
WORKDIR /app/backend
RUN npm install --omit=dev

# Set permissions for non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port for backend
EXPOSE 3000

# Command to run the backend server
CMD ["node", "dist/main.js"]
