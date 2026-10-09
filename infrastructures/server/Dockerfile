# Build from the repository root:
# docker build -f infrastructures/server/Dockerfile -t hono-server .
FROM alpine:3.24 AS base

WORKDIR /app

RUN apk add --no-cache nodejs npm

RUN npm install --global pnpm@11.11.0

FROM base AS pruner

COPY . .

RUN pnpm dlx "turbo@$(node -p 'require("./package.json").devDependencies.turbo')" prune server --docker

FROM base AS builder

RUN apk add --no-cache make

COPY --from=pruner /app/out/json/ ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /app/out/full/ ./

RUN pnpm --filter server... -r run build \
    && pnpm --filter server deploy --prod --no-optional --legacy /deploy

FROM alpine:3.24 AS runner

ARG COMMIT_SHA=development

ENV NODE_ENV=production
ENV PORT=3000
ENV APP_VERSION=${COMMIT_SHA}

WORKDIR /app

RUN apk add --no-cache nodejs \
    && addgroup -S -g 1001 nodejs \
    && adduser -S -D -u 1001 -G nodejs hono

COPY --from=builder --chown=hono:nodejs /deploy/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /deploy/dist ./dist
COPY --from=builder --chown=hono:nodejs /deploy/package.json ./package.json

USER hono

EXPOSE 3000

CMD ["node", "--conditions=production", "/app/dist/index.js"]
