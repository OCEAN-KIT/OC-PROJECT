// RegionPopup.tsx
"use client";

import { STAGE_META, getStageColor } from "@/shared/model/stage-meta";
import type { MouseEvent } from "react";
import type { AreaSummary } from "@ocean-kit/dashboard-domain/types/areas";

type RegionPopupProps = {
  region: AreaSummary | null;
  onOpen: () => void;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

// ----- 작은 색 유틸: hex → rgba, lighten -----
function hexToRgb(hex: string): Rgb | null {
  if (!hex) return null;
  const h = hex.replace("#", "");
  if (![3, 6].includes(h.length)) return null;
  const v =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return { r, g, b };
}

function rgba(hex: string, alpha = 1) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(229,231,235,${alpha})`; // fallback slate-200
  const { r, g, b } = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
/** 흰색과 섞어서 밝게 만들기 (t: 0~1) */
function lighten(hex: string, t = 0.35) {
  const rgb = hexToRgb(hex) ?? { r: 229, g: 231, b: 235 }; // slate-200 fallback
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  return `rgb(${mix(rgb.r)}, ${mix(rgb.g)}, ${mix(rgb.b)})`;
}

/** stage → 팝업 스타일 계산 (constants는 그대로) **/
function getPopupStyle(stage: string) {
  const base = getStageColor(stage); // STAGE_META의 color 사용
  const text = lighten(base, 0.4);
  const bg = rgba(base, 0.22);
  const ring = rgba(base, 0.4);
  const dot = lighten(base, 0.55);
  return { text, bg, ring, dot };
}

function formatDate(ymd: unknown) {
  if (!Array.isArray(ymd)) return "-";
  const [y, m, d] = ymd;
  if (!y || !m || !d) return "-";
  return `${y}년 ${m}월 ${d}일`;
}

function setButtonHoverStyle(
  event: MouseEvent<HTMLButtonElement>,
  isHovering: boolean,
) {
  event.currentTarget.style.transform = isHovering
    ? "translateY(-1px)"
    : "translateY(0)";
  event.currentTarget.style.background = isHovering
    ? "rgba(129,140,248,.34)"
    : "rgba(99,102,241,.24)";
  event.currentTarget.style.boxShadow = isHovering
    ? "inset 0 1px 0 rgba(255,255,255,.28), 0 12px 22px rgba(79,70,229,.35)"
    : "inset 0 1px 0 rgba(255,255,255,.25)";
}

export default function RegionPopup({ region, onOpen }: RegionPopupProps) {
  if (!region) return null;

  const { name, startDate, level, depth, habitat } = region;
  const stage = String(level);
  const stageCfg = getPopupStyle(stage);

  return (
    <div
      style={{
        background:
          "linear-gradient(160deg, rgba(30,41,59,.82) 0%, rgba(15,23,42,.88) 52%, rgba(15,23,42,.92) 100%)",
        color: "#e2e8f0",
        borderRadius: 14,
        padding: "12px 14px",
        fontSize: 13.5,
        lineHeight: 1.35,
        boxShadow: "0 18px 36px rgba(2,6,23,.55)",
        border: "1px solid rgba(255,255,255,.24)",
        backdropFilter: "saturate(170%) blur(14px)",
        WebkitBackdropFilter: "saturate(170%) blur(14px)",
        minWidth: 240,
        maxWidth: 320,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 10,
            height: 10,
            borderRadius: "9999px",
            background: stageCfg.dot,
            boxShadow: `0 0 0 4px ${stageCfg.bg}`,
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
          {name ?? "-"}
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 700,
            color: stageCfg.text,
            background: stageCfg.bg,
            padding: "4px 9px",
            borderRadius: 999,
            border: `1px solid ${stageCfg.ring}`,
            letterSpacing: ".02em",
          }}
        >
          {stage in STAGE_META ? stage : "단계 미지정"}
        </span>
      </div>

      {/* 구분선 */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(148,163,184,.35), transparent)",
          margin: "6px 0 10px",
        }}
      />

      {/* 본문 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "86px 1fr",
          rowGap: 6,
          columnGap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ color: "rgba(199,210,254,.78)" }}>복원 시작일</div>
        <div style={{ fontWeight: 600 }}>{formatDate(startDate)}</div>

        <div style={{ color: "rgba(199,210,254,.78)" }}>수심</div>
        <div style={{ fontWeight: 600 }}>
          {depth != null ? `${depth} m` : "-"}
        </div>

        <div style={{ color: "rgba(199,210,254,.78)" }}>해역 유형</div>
        <div style={{ fontWeight: 600 }}>{habitat ?? "-"}</div>
      </div>

      {/* 장식 라인 */}
      <div
        aria-hidden
        style={{
          marginTop: 10,
          height: 2,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,.6), rgba(129,140,248,.8), rgba(249,115,22,.6), transparent)",
          filter: "blur(.2px)",
        }}
      />

      {/* 자세히 보러가기 버튼 */}
      <div
        style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}
      >
        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12.5,
            fontWeight: 600,
            color: "#f8fafc",
            background: "rgba(99,102,241,.24)",
            border: "1px solid rgba(199,210,254,.52)",
            borderRadius: 999,
            padding: "6px 10px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.25)",
            cursor: "pointer",
            transition:
              "transform 180ms ease, box-shadow 180ms ease, background 180ms ease",
          }}
          onMouseEnter={(event) => setButtonHoverStyle(event, true)}
          onMouseLeave={(event) => setButtonHoverStyle(event, false)}
          onClick={onOpen}
        >
          <span>상세 보기</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
