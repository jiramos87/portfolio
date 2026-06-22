# Portfolio API (NestJS) — build from the REPO ROOT context:
#   docker build -f apps/api/Dockerfile -t portfolio-api .
# On Railway: set the service root to the repo and this Dockerfile path.

FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@11.8.0 --activate
WORKDIR /app

# Workspace manifests + lockfile first (better layer caching)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps ./apps

# Install only the api workspace + its deps; postinstall runs `prisma generate`.
RUN pnpm install --frozen-lockfile --filter api...
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api build

FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@11.8.0 --activate
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app ./
WORKDIR /app/apps/api

# Railway/host injects DATABASE_URL, PORT (and optionally GITHUB_TOKEN) at runtime.
EXPOSE 3333
CMD ["node", "dist/main.js"]
