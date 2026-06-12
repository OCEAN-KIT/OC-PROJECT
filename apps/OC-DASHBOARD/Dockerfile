FROM node:22-alpine AS builder

WORKDIR /repo

ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/OC-ADMIN/package.json apps/OC-ADMIN/package.json
COPY apps/OC-DASHBOARD/package.json apps/OC-DASHBOARD/package.json
COPY apps/OC-RECORD/package.json apps/OC-RECORD/package.json
COPY packages/shared-axios/package.json packages/shared-axios/package.json
COPY packages/shared-auth/package.json packages/shared-auth/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/dashboard-domain/package.json packages/dashboard-domain/package.json
COPY packages/submission-domain/package.json packages/submission-domain/package.json

RUN pnpm install --frozen-lockfile

COPY apps/OC-DASHBOARD apps/OC-DASHBOARD
COPY packages packages

ARG API_BASE_URL
ARG S3_PUBLIC_BASE
ARG MAPBOX_TOKEN

ENV API_BASE_URL=$API_BASE_URL
ENV S3_PUBLIC_BASE=$S3_PUBLIC_BASE
ENV MAPBOX_TOKEN=$MAPBOX_TOKEN

RUN pnpm turbo build --filter=@ocean-kit/oc-dashboard

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /repo/apps/OC-DASHBOARD/.next/standalone ./
COPY --from=builder /repo/apps/OC-DASHBOARD/.next/static ./apps/OC-DASHBOARD/.next/static
COPY --from=builder /repo/apps/OC-DASHBOARD/public ./apps/OC-DASHBOARD/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/OC-DASHBOARD/server.js"]
