FROM node:22-alpine AS builder

WORKDIR /repo

ENV CI=true

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

COPY apps/OC-ADMIN apps/OC-ADMIN
COPY packages packages

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
ARG NEXT_PUBLIC_S3_PUBLIC_BASE=

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_S3_PUBLIC_BASE=$NEXT_PUBLIC_S3_PUBLIC_BASE

RUN pnpm turbo build --filter=@ocean-kit/oc-admin

FROM nginx:1.27-alpine AS runner

COPY apps/OC-ADMIN/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/apps/OC-ADMIN/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
