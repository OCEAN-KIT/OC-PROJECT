/* eslint-disable no-restricted-globals */

const SW_VERSION = "oc-record-v2";
const PAGE_CACHE = `${SW_VERSION}-pages`;
const ASSET_CACHE = `${SW_VERSION}-assets`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;

const PRECACHE_PAGES = [
  "/",
  "/login",
  "/home",
  "/dive-create",
  "/dive-drafts",
  "/submit-management",
  "/profile",
];

const PRECACHE_ASSETS = [
  "/manifest.webmanifest",
  "/icons/Ocean-Campus-Logo192.png",
  "/icons/Ocean-Campus-Logo512.png",
  "/images/ocn.svg",
];

const STATIC_ASSET_PATTERN =
  /\/(_next\/static|_next\/image)\/|\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)$/i;

const OFFLINE_HTML = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>오프라인</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 24px; color: #111827; }
      .card { max-width: 420px; margin: 12vh auto 0; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; }
      h1 { margin: 0 0 8px; font-size: 18px; }
      p { margin: 0; color: #4b5563; line-height: 1.45; }
      a { display: inline-block; margin-top: 14px; color: #0369a1; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>오프라인 상태입니다</h1>
      <p>네트워크 연결이 복구되면 최신 데이터를 불러옵니다. 저장된 화면은 오프라인에서도 열 수 있습니다.</p>
      <a href="/home">홈으로 이동</a>
    </div>
  </body>
</html>`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const pageCache = await caches.open(PAGE_CACHE);
      const assetCache = await caches.open(ASSET_CACHE);

      await Promise.allSettled(PRECACHE_PAGES.map((url) => pageCache.add(url)));
      await Promise.allSettled(PRECACHE_ASSETS.map((url) => assetCache.add(url)));

      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("oc-record-") && !key.startsWith(SW_VERSION))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const network = await networkPromise;
  if (network) {
    return network;
  }

  throw new Error("No cached response and network unavailable");
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) {
      return cached;
    }

    const fallback =
      (await cache.match("/home")) ||
      (await cache.match("/login")) ||
      (await cache.match("/"));

    if (fallback) {
      return fallback;
    }

    return new Response(OFFLINE_HTML, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

async function networkFirstRuntime(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) {
      return cached;
    }
    throw new Error("No runtime cache entry");
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = request.mode === "navigate";
  const isApi = isSameOrigin && url.pathname.startsWith("/api/");
  const isRscRequest = request.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
  const isStaticAsset = STATIC_ASSET_PATTERN.test(url.pathname);

  if (isNavigation) {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (isApi) {
    // API는 최신성을 우선하고, 오프라인 fallback은 페이지 단에서 처리한다.
    event.respondWith(fetch(request));
    return;
  }

  if (isStaticAsset) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
    return;
  }

  if (isSameOrigin && isRscRequest) {
    event.respondWith(networkFirstRuntime(request));
    return;
  }

  if (isSameOrigin) {
    event.respondWith(networkFirstRuntime(request));
  }
});
