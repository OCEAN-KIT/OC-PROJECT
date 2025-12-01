// app/pair-watch/page.tsx
"use client";

import Image from "next/image";
import { Watch, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PairWatchPage() {
  const router = useRouter();

  return (
    <div
      className="
        mx-auto min-h-screen max-w-[420px]
        bg-[#F6F7F9] text-gray-900
        flex flex-col
      "
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <main className="flex-1 px-5 py-8 flex flex-col">
        {/* 상단 타이틀 영역 */}
        <header className="mb-6">
          <h1 className="mt-2 text-[20px] font-semibold text-gray-900">
            다이빙 워치 등록
          </h1>
          <p className="mt-1 text-[13px] text-gray-500">
            시계를 등록하면 다이빙 활동 기록을 자동으로 불러올 수 있어요.
          </p>
        </header>

        {/* 중앙: 워치 이미지 + 페어링 코드 입력 메인 블록 */}
        <section className="flex-1 flex flex-col items-center justify-center gap-8 -mt-40">
          {/* 워치 이미지 */}
          <div className="flex flex-col items-center">
            <div
              className="
                relative
                h-100 w-100
                rounded-full
                flex items-center justify-center
              "
            >
              <Image
                src="/images/gm.png"
                alt="Garmin dive watch"
                width={400}
                height={400}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* 라벨 + 아이콘 */}
          <div className="flex flex-col items-center gap-2 -mt-20">
            <div className="flex items-center gap-2 text-gray-600">
              <KeyRound className="h-4 w-4" />
              <span className="text-[13px] font-semibold">페어링 코드</span>
            </div>
            <span className="text-[11px] text-gray-400">
              가민 시계에 표시된 6자리 숫자를 그대로 입력해 주세요.
            </span>
          </div>

          {/* 코드 입력 박스 (메인 포커스) */}
          <div className="flex justify-center gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="
                  h-16 w-12
                  rounded-2xl
                  border-0 ring-1 ring-gray-200
                  bg-white text-center
                  text-[24px] font-semibold tracking-[0.18em]
                  text-gray-900
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                "
              />
            ))}
          </div>

          {/* 간단 안내 */}
          <div className="w-full space-y-1">
            <p className="text-[11px] font-semibold text-gray-700">
              시계에서 코드를 확인하는 방법
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-gray-500">
              <li>가민 시계에서 다이빙 앱을 실행합니다.</li>
              <li>설정 &gt; 기기 연결 메뉴로 이동합니다.</li>
              <li>화면에 보이는 6자리 코드를 이 페이지에 입력합니다.</li>
            </ol>
          </div>
        </section>

        {/* 하단 버튼 영역 */}
        <section className="mt-6 flex flex-col gap-2">
          <button
            type="submit"
            className="
              h-12 w-full rounded-2xl
              bg-[#3B82F6] text-white text-[14px] font-semibold
              shadow-md active:translate-y-[1px]
              transition
            "
          >
            시계 등록
          </button>
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="
              h-11 w-full rounded-2xl
              border-0 ring-1 ring-gray-200
              bg-white text-[13px] font-medium text-gray-700
              active:translate-y-[1px]
              transition
            "
          >
            나중에 등록
          </button>
        </section>
      </main>
    </div>
  );
}
