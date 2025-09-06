# Development and Production Dockerfile for Next.js in Turborepo
# This Dockerfile supports both development and production builds
# Context: Run from the root of the monorepo

# Customize APP and WORKSPACE to match this app
ARG APP=web
ARG WORKSPACE=@repo/web

FROM node:22-alpine AS base
# Install libc6-compat for compatibility
RUN apk update && apk add --no-cache libc6-compat curl
RUN corepack enable

# -------------------------- stage pruned ---------------------------------
FROM base AS pruned
ARG WORKSPACE

WORKDIR /app
COPY . .

# Prune the workspace for this specific app
RUN npm install -g turbo@^2.0.9
RUN turbo prune ${WORKSPACE} --docker

# -------------------------- stage dev-deps ---------------------------------
FROM base AS dev-deps
ARG APP

WORKDIR /app

# Install development dependencies
COPY .gitignore .gitignore
COPY --from=pruned /app/out/json/ .
COPY --from=pruned /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g turbo@^2.0.9
RUN --mount=type=cache,target=/root/.local/share/pnpm,sharing=locked \
    pnpm install --prefer-offline --frozen-lockfile

# -------------------------- stage dev ---------------------------------
FROM base AS dev
ARG APP
ARG WORKSPACE

WORKDIR /app

# Copy installed dependencies
COPY --from=dev-deps /app .

# Copy source code
COPY --from=pruned /app/out/full/ .
COPY turbo.json turbo.json

# Set working directory to the web app
WORKDIR /app/apps/${APP}

# Expose Next.js development port
EXPOSE 3000

# Development command with hot reload
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]

# -------------------------- stage prod-deps ---------------------------------
FROM base AS prod-deps
ARG APP

WORKDIR /app

# Install production dependencies only
COPY .gitignore .gitignore
COPY --from=pruned /app/out/json/ .
COPY --from=pruned /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g turbo@^2.0.9
RUN --mount=type=cache,target=/root/.local/share/pnpm,sharing=locked \
    pnpm install --prefer-offline --frozen-lockfile --prod

# -------------------------- stage builder ---------------------------------
FROM base AS builder
ARG APP
ARG WORKSPACE

WORKDIR /app

# Copy dependencies
COPY --from=prod-deps /app .

# Copy source code and build configuration
COPY --from=pruned /app/out/full/ .
COPY turbo.json turbo.json

# Build the application
RUN npm install -g turbo@^2.0.9
RUN turbo run build --filter=${WORKSPACE}

# -------------------------- stage production ---------------------------------
FROM base AS production
ARG APP

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/apps/${APP}/public ./apps/${APP}/public

# Set correct permissions for prerender cache
RUN mkdir -p ./apps/${APP}/.next
RUN chown nextjs:nextjs ./apps/${APP}/.next

# Copy built Next.js app
COPY --from=builder --chown=nextjs:nextjs /app/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Production start command
CMD ["node", "apps/web/server.js"]