"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import { keyToPublicUrl } from "../../../lib/public-image-url";
import type { OpenPhoto } from "./types";

type LoadState = "empty" | "loading" | "loaded" | "error";
type LoadSnapshot = {
  src: string;
  state: LoadState;
};

type Props = {
  url?: string | null;
  alt: string;
  label?: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  emptyText?: string;
  onOpen?: OpenPhoto;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export default function PhotoFrame({
  url,
  alt,
  label,
  sizes,
  className,
  imageClassName = "object-cover",
  emptyText = "사진 없음",
  onOpen,
}: Props) {
  const src = useMemo(() => (url ? keyToPublicUrl(url) : ""), [url]);
  const [loadSnapshot, setLoadSnapshot] = useState<LoadSnapshot>({
    src,
    state: src ? "loading" : "empty",
  });

  useEffect(() => {
    setLoadSnapshot({ src, state: src ? "loading" : "empty" });
  }, [src]);

  const loadState =
    loadSnapshot.src === src ? loadSnapshot.state : src ? "loading" : "empty";
  const isLoaded = loadState === "loaded";
  const canOpen = Boolean(src && isLoaded && onOpen);

  const handleOpen = () => {
    if (!src || !isLoaded || !onOpen) return;
    onOpen({ src, alt, label });
  };

  return (
    <div
      className={cx(
        "relative flex items-center justify-center overflow-hidden rounded-xl bg-black/55",
        className
      )}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            className={cx(
              "transition-opacity duration-200",
              imageClassName,
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes={sizes}
            onLoad={() => setLoadSnapshot({ src, state: "loaded" })}
            onError={() => setLoadSnapshot({ src, state: "error" })}
          />

          {loadState === "loading" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/25">
              <ClipLoader color="#e0e7ff" size={26} speedMultiplier={0.85} />
            </div>
          )}

          {loadState === "error" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 px-4 text-center text-[12px] text-white/55">
              사진을 불러오지 못했습니다.
            </div>
          )}

          {canOpen && (
            <button
              type="button"
              className="absolute inset-0 z-20 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-indigo-200"
              aria-label={`${label ?? alt} 크게 보기`}
              onClick={handleOpen}
            />
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center px-4 text-center text-[12px] text-white/35">
          {emptyText}
        </div>
      )}

      {label && (
        <span className="pointer-events-none absolute bottom-2 left-2 z-30 rounded bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white/85">
          {label}
        </span>
      )}
    </div>
  );
}
