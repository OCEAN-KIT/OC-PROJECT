// src/app/review/[id]/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Users,
  Image as ImageIcon,
  Thermometer,
  Waves,
  Eye,
  Anchor,
  MapPin,
} from "lucide-react";

import { REVIEW_ITEMS, type ReviewItem } from "@/data/reviews";
import { DIVE_PARTICIPANTS } from "@/data/dive-session";
import { DIVER_ACTIVITY_LOGS, type DiverActivityLog } from "@/data/diver-log";

export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const diveId = String(params.id);

  const review = useMemo<ReviewItem | undefined>(
    () => REVIEW_ITEMS.find((r) => r.id === diveId),
    [diveId]
  );

  const participants = useMemo(
    () => DIVE_PARTICIPANTS[diveId]?.participants ?? [],
    [diveId]
  );

  const allLogs = useMemo<DiverActivityLog[]>(
    () => DIVER_ACTIVITY_LOGS.filter((l) => l.diveId === diveId),
    [diveId]
  );

  // 기본 선택: 첫 참가자 or 첫 로그의 다이버
  const [activeDiverId, setActiveDiverId] = useState<string>(() => {
    return participants[0]?.diverId ?? allLogs[0]?.diverId ?? "";
  });

  const diverLogs = useMemo(
    () => allLogs.filter((l) => l.diverId === activeDiverId),
    [allLogs, activeDiverId]
  );

  if (!review) {
    return (
      <div className="mx-auto max-w-[1100px] p-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#34609E] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </button>
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          데이터를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  // 공통 정보: 세션 공통 “작업일자”만 노출
  const commonDate =
    diverLogs[0]?.env?.diveDate ??
    new Date(review.datetime).toISOString().slice(0, 10);
  const participantCount = participants.length;

  return (
    <div className="mx-auto max-w-[1100px] p-6">
      {/* 상단 바 */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-[#34609E] ring-1 ring-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </button>

        <div className="text-lg font-bold tracking-tight text-gray-900">
          Dive #{review.id}
        </div>

        <div className="h-6 w-[84px]" />
      </div>

      {/* 세션 공통 정보 */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarClock className="h-4 w-4 text-gray-400" />
            <span className="font-medium">작업일자</span>
            <span>{commonDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="font-medium">참여 인원</span>
            <span>{participantCount}명</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{review.site}</span>
          </div>
        </div>
      </div>

      {/* 다이버 선택 토글 */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {participants.map((p) => {
          const active = p.diverId === activeDiverId;
          return (
            <button
              key={p.diverId}
              type="button"
              onClick={() => setActiveDiverId(p.diverId)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition
                ${
                  active
                    ? "bg-[#34609E] text-white ring-transparent"
                    : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
                }
              `}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs font-semibold">
                {p.name.slice(0, 1)}
              </span>
              <span>{p.name}</span>
              <span className="text-xs opacity-70">({p.role})</span>
            </button>
          );
        })}
      </div>

      {/* 선택된 다이버의 개인 기록 */}
      <section className="mt-6 space-y-4">
        {diverLogs.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 ring-1 ring-black/5">
            선택된 다이버의 기록이 없습니다.
          </div>
        ) : (
          diverLogs.map((log, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white p-5 ring-1 ring-black/5"
            >
              {/* 개인 환경정보 요약(있을 때만) */}
              {log.env && (
                <div className="mb-5 grid gap-4 md:grid-cols-4">
                  <Info
                    item="수온"
                    value={`${log.env.waterTempC}℃`}
                    icon={<Thermometer className="h-4 w-4 text-gray-400" />}
                  />
                  <Info
                    item="조류"
                    value={log.env.current}
                    icon={<Waves className="h-4 w-4 text-gray-400" />}
                  />
                  <Info
                    item="가시거리"
                    value={`${log.env.visibilityM}m`}
                    icon={<Eye className="h-4 w-4 text-gray-400" />}
                  />
                  <Info
                    item="수심"
                    value={`${log.env.depthM}m`}
                    icon={<Anchor className="h-4 w-4 text-gray-400" />}
                  />
                </div>
              )}

              {/* 활동 라벨 */}
              <div className="mb-3">
                <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {labelActivity(log.activity)}
                </span>
              </div>

              {/* 세부내용 */}
              <div className="mb-4">
                <h3 className="mb-1 text-xs font-semibold text-gray-500">
                  세부내용
                </h3>
                <p className="whitespace-pre-wrap text-sm text-gray-800">
                  {log.details}
                </p>
              </div>

              {/* 사진 썸네일 */}
              {log.media?.photos?.length ? (
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-semibold text-gray-500">
                    첨부 사진
                  </h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {log.media.photos.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-gray-200"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt="dive-photo"
                          className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/40 px-1.5 py-0.5 text-[11px] text-white">
                          <ImageIcon className="h-3 w-3" />
                          photo
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* 환경 이상/사고 보고 */}
              {log.incidentOrAbnormal ? (
                <div>
                  <h3 className="mb-1 text-xs font-semibold text-gray-500">
                    환경 이상/사고 보고
                  </h3>
                  <div className="rounded-lg px-0 py-0 text-sm text-gray-800">
                    {log.incidentOrAbnormal}
                  </div>
                </div>
              ) : null}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

/* 작은 정보 블록 */
function Info({
  item,
  value,
  icon,
}: {
  item: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700 ring-1 ring-gray-200">
      {icon}
      <span className="font-medium">{item}</span>
      <span className="ml-auto">{value}</span>
    </div>
  );
}

function labelActivity(a: DiverActivityLog["activity"]) {
  switch (a) {
    case "Transplantation":
      return "이식";
    case "DebrisRemoval":
      return "폐기물 수거";
    case "Research":
      return "연구";
    case "Monitoring":
      return "모니터링";
    default:
      return "기타";
  }
}
