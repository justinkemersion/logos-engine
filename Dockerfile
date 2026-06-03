# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

FROM base AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG AUTH_SECRET=ci-build-secret-min-32-characters-long
ARG AUTH_GITHUB_ID=ci
ARG AUTH_GITHUB_SECRET=ci
ARG FLUX_URL=https://flux.example
ARG FLUX_GATEWAY_JWT_SECRET=ci-gateway-secret-min-16
ENV NEXT_TELEMETRY_DISABLED=1 \
  AUTH_SECRET=${AUTH_SECRET} \
  AUTH_GITHUB_ID=${AUTH_GITHUB_ID} \
  AUTH_GITHUB_SECRET=${AUTH_GITHUB_SECRET} \
  FLUX_URL=${FLUX_URL} \
  FLUX_GATEWAY_JWT_SECRET=${FLUX_GATEWAY_JWT_SECRET}
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  PORT=3000 \
  HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+ (process.env.PORT||3000) +'/read').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
