"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const UPDATE_CHECK_INTERVAL_MS = 5 * 60 * 1000;
const UPDATE_CHECK_THROTTLE_MS = 30 * 1000;

function getCurrentEntryAsset() {
  const script = document.querySelector<HTMLScriptElement>(
    'script[type="module"][src*="/record/assets/index-"]',
  );
  if (!script?.src) return null;

  return new URL(script.src).pathname.replace(/^\/record\//, "");
}

function getLatestEntryAsset(serviceWorkerScript: string) {
  return (
    serviceWorkerScript.match(/assets\/index-[A-Za-z0-9_-]+\.js/)?.[0] ?? null
  );
}

export default function SWRegister() {
  const [hasNetworkUpdate, setHasNetworkUpdate] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError: () => undefined,
  });
  const lastUpdateCheckAtRef = useRef(0);
  const shouldShowUpdatePrompt = needRefresh || hasNetworkUpdate;

  const checkLatestBuild = useCallback(async () => {
    try {
      const currentEntryAsset = getCurrentEntryAsset();
      if (!currentEntryAsset) return;

      const response = await fetch(
        `${import.meta.env.BASE_URL}sw.js?oc-update-check=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) return;

      const latestEntryAsset = getLatestEntryAsset(await response.text());
      if (latestEntryAsset && latestEntryAsset !== currentEntryAsset) {
        setHasNetworkUpdate(true);
      }
    } catch {
      // PWA update checks must not break the app shell.
    }
  }, []);

  const checkForUpdate = useCallback(async () => {
    if (import.meta.env.DEV) return;

    const now = Date.now();
    if (now - lastUpdateCheckAtRef.current < UPDATE_CHECK_THROTTLE_MS) return;
    lastUpdateCheckAtRef.current = now;

    await checkLatestBuild();

    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration(
      import.meta.env.BASE_URL,
    );

    if (!registration) return;

    if (registration.waiting) {
      setNeedRefresh(true);
      return;
    }

    await registration.update();

    if (registration.waiting) {
      setNeedRefresh(true);
    }
  }, [checkLatestBuild, setNeedRefresh]);

  const applyUpdate = useCallback(async () => {
    const registration = await navigator.serviceWorker.getRegistration(
      import.meta.env.BASE_URL,
    );

    await registration?.update();

    if (registration?.waiting) {
      await updateServiceWorker(true);
      return;
    }

    if (hasNetworkUpdate) {
      await registration?.unregister();

      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.includes("workbox-precache") ||
                cacheName.includes("/record/"),
            )
            .map((cacheName) => caches.delete(cacheName)),
        );
      }
    }

    window.location.reload();
  }, [hasNetworkUpdate, updateServiceWorker]);

  useEffect(() => {
    if (import.meta.env.DEV) return;

    void checkForUpdate();

    const intervalId = window.setInterval(
      () => void checkForUpdate(),
      UPDATE_CHECK_INTERVAL_MS,
    );
    const handleFocus = () => void checkForUpdate();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkForUpdate();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkForUpdate]);

  if (!shouldShowUpdatePrompt) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[120] mx-auto w-[min(92vw,24rem)] px-3">
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-blue-100 bg-white p-4 shadow-2xl shadow-blue-950/15"
      >
        <p className="text-sm font-semibold text-gray-900">
          새 버전이 준비됐습니다.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="h-10 flex-1 rounded-xl bg-[#2F80ED] px-4 text-sm font-semibold text-white transition hover:brightness-105"
            onClick={() => {
              void applyUpdate();
            }}
          >
            업데이트
          </button>
          <button
            type="button"
            className="h-10 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            onClick={() => {
              setNeedRefresh(false);
              setHasNetworkUpdate(false);
            }}
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}
