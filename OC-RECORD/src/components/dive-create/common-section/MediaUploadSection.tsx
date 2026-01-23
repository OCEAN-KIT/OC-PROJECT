"use client";

import { Images, Plus } from "lucide-react";
import { cardCls } from "../styles";

type Props = {
  attachments: File[];
  fileRef: React.RefObject<HTMLInputElement | null>;
  onPickFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (idx: number) => void;
  maxCount?: number;
};

export default function MediaUploadSection({
  attachments,
  fileRef,
  onPickFiles,
  onRemove,
  maxCount = 10,
}: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Images className="h-4 w-4 text-sky-600" />
          <h2 className="text-[14px] font-semibold text-gray-800">
            활동 사진 및 동영상
          </h2>
        </div>
        <span className="text-[12px] text-gray-400">
          {attachments.length}/{maxCount}
        </span>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={onPickFiles}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="h-20 w-20 rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 hover:bg-sky-50 text-sky-700 flex flex-col items-center justify-center shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span className="text-[11px] mt-1">추가</span>
        </button>

        <div className="flex flex-wrap gap-2">
          {attachments.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              className="relative h-20 w-20 overflow-hidden rounded-xl bg-white border border-gray-200"
            >
              {f.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
                  🎬
                </div>
              )}

              <button
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-black/70 text-white text-xs"
                onClick={() => onRemove(idx)}
                type="button"
                aria-label="remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
