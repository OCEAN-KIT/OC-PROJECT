"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { PhotoPreview } from "./types";

type Props = {
  photo: PhotoPreview | null;
  onClose: () => void;
};

export default function PhotoLightbox({ photo, onClose }: Props) {
  useEffect(() => {
    if (!photo) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      onClose();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="확대 사진"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="확대 사진 닫기"
        className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/85 backdrop-blur transition hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-200"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        <X size={18} strokeWidth={2} />
      </button>

      <div
        className="relative h-[min(82vh,760px)] w-[min(94vw,1120px)]"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-contain"
          sizes="94vw"
        />
      </div>

      {photo.label && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[12px] font-medium text-white/85 backdrop-blur">
          {photo.label}
        </div>
      )}
    </div>
  );
}
