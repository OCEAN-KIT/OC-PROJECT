"use client";

import PhotoFrame from "./photo-frame";
import type { OpenPhoto } from "./types";

type Props = {
  beforeUrl: string;
  afterUrl: string;
  onOpenPhoto: OpenPhoto;
};

export default function BeforeAfterCard({
  beforeUrl,
  afterUrl,
  onOpenPhoto,
}: Props) {
  const hasData = beforeUrl || afterUrl;

  return (
    <div className="min-h-[260px]">
      {hasData ? (
        <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
          <PhotoFrame
            url={beforeUrl}
            alt="복원 전 사진"
            label="복원 전"
            sizes="(max-width: 768px) 92vw, 380px"
            className="aspect-[16/9] min-h-[180px] max-md:min-h-[240px]"
            onOpen={onOpenPhoto}
          />
          <PhotoFrame
            url={afterUrl}
            alt="복원 후 사진"
            label="복원 후"
            sizes="(max-width: 768px) 92vw, 380px"
            className="aspect-[16/9] min-h-[180px] max-md:min-h-[240px]"
            onOpen={onOpenPhoto}
          />
        </div>
      ) : (
        <div className="flex min-h-[260px] items-center justify-center text-sm text-white/40">
          사진 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}
