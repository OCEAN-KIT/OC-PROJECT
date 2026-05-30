FROM node:22-alpine AS builder

WORKDIR /repo

ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/OC-ADMIN/package.json apps/OC-ADMIN/package.json
COPY apps/OC-DASHBOARD/package.json apps/OC-DASHBOARD/package.json
COPY apps/OC-RECORD/package.json apps/OC-RECORD/package.json
COPY packages/shared-axios/package.json packages/shared-axios/package.json
COPY packages/shared-auth/package.json packages/shared-auth/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/dashboard-domain/package.json packages/dashboard-domain/package.json
COPY packages/submission-domain/package.json packages/submission-domain/package.json

RUN pnpm install --frozen-lockfile

COPY apps/OC-RECORD apps/OC-RECORD
COPY packages packages

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_BASE_DEV
ARG NEXT_PUBLIC_FB_API_KEY
ARG NEXT_PUBLIC_FB_AUTH_DOMAIN
ARG NEXT_PUBLIC_FB_PROJECT_ID
ARG NEXT_PUBLIC_FB_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FB_APP_ID
ARG NEXT_PUBLIC_FB_VAPID_KEY
ARG NEXT_PUBLIC_S3_PUBLIC_BASE
ARG NEXT_PUBLIC_USE_DEV_BEARER
ARG NEXT_PUBLIC_DEV_BEARER

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_DEV=$NEXT_PUBLIC_API_BASE_DEV
ENV NEXT_PUBLIC_FB_API_KEY=$NEXT_PUBLIC_FB_API_KEY
ENV NEXT_PUBLIC_FB_AUTH_DOMAIN=$NEXT_PUBLIC_FB_AUTH_DOMAIN
ENV NEXT_PUBLIC_FB_PROJECT_ID=$NEXT_PUBLIC_FB_PROJECT_ID
ENV NEXT_PUBLIC_FB_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FB_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FB_APP_ID=$NEXT_PUBLIC_FB_APP_ID
ENV NEXT_PUBLIC_FB_VAPID_KEY=$NEXT_PUBLIC_FB_VAPID_KEY
ENV NEXT_PUBLIC_S3_PUBLIC_BASE=$NEXT_PUBLIC_S3_PUBLIC_BASE
ENV NEXT_PUBLIC_USE_DEV_BEARER=$NEXT_PUBLIC_USE_DEV_BEARER
ENV NEXT_PUBLIC_DEV_BEARER=$NEXT_PUBLIC_DEV_BEARER

RUN pnpm turbo build --filter=@ocean-kit/oc-record

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /repo/apps/OC-RECORD/.next/standalone ./
COPY --from=builder /repo/apps/OC-RECORD/.next/static ./apps/OC-RECORD/.next/static
COPY --from=builder /repo/apps/OC-RECORD/public ./apps/OC-RECORD/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/OC-RECORD/server.js"]
