# === Base Stage for Frontend and Backend ===
FROM node:23-alpine AS base
WORKDIR /app

# === Frontend Builder ===
FROM base AS frontend-builder
WORKDIR /frontend
COPY ./frontend ./
RUN npm install --omit=dev && npm run build

# === Backend Builder ===
FROM base AS backend-builder
WORKDIR /backend
COPY ./ ./
RUN npm install --omit=dev && npm run build

# === Production Runner ===
FROM base AS runner

# Prepare directories
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/frontend /app/backend

# Copy built frontend files
COPY --from=frontend-builder /frontend/dist /app/frontend

# Copy built backend files
COPY --from=backend-builder /backend/dist /app/backend
COPY --from=backend-builder /backend/package.json /app/backend

# Set up environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install backend production dependencies
WORKDIR /app/backend
RUN npm install --omit=dev

# Set permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port and define command
EXPOSE 3000
CMD ["node", "main.js"]
