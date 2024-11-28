FROM node:23-alpine AS base
WORKDIR /app

FROM base AS backend-builder
WORKDIR /backend
COPY ./package.json ./package-lock.json ./
RUN npm i npm-run-all
RUN npm install
COPY ./ ./
RUN npm run build

FROM node:23-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/frontend /app/backend

COPY --from=backend-builder /backend/dist /app/backend
COPY --from=backend-builder /backend/package.json /app/backend

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/backend
RUN npm install

COPY ./frontend /app/frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["node", "dist/main.js"]
