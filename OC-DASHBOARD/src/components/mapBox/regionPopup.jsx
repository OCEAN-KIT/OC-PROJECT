// RegionPopup.jsx
"use client";

const STAGE_STYLE = {
  "이식 완료": { text: "#10b981", bg: "rgba(16,185,129,.15)", dot: "#34d399" },
  "성장 중": { text: "#60a5fa", bg: "rgba(96,165,250,.15)", dot: "#93c5fd" },
  "안정화 구역": {
    text: "#a78bfa",
    bg: "rgba(167,139,250,.15)",
    dot: "#c4b5fd",
  },
  "모니터링 중": {
    text: "#94a3b8",
    bg: "rgba(148,163,184,.15)",
    dot: "#cbd5e1",
  },
};

function formatDate(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  } catch {
    return iso;
  }
}

export default function RegionPopup({ region }) {
  if (!region) return null;

  const { label, startDate, stage, depth, habitat } = region;
  const stageCfg = STAGE_STYLE[stage] || {
    text: "#e5e7eb",
    bg: "rgba(229,231,235,.12)",
    dot: "#e5e7eb",
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(15,23,42,.92) 0%, rgba(2,6,23,.88) 100%)",
        color: "#e5e7eb",
        borderRadius: 14,
        padding: "12px 14px",
        fontSize: 13.5,
        lineHeight: 1.35,
        boxShadow: "0 12px 32px rgba(0,0,0,.45)",
        border: "1px solid rgba(148,163,184,.25)",
        backdropFilter: "saturate(160%) blur(10px)",
        WebkitBackdropFilter: "saturate(160%) blur(10px)",
        minWidth: 220,
        maxWidth: 300,
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
          {label ?? "-"}
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            fontWeight: 700,
            color: stageCfg.text,
            background: stageCfg.bg,
            padding: "4px 8px",
            borderRadius: 999,
            border: `1px solid ${stageCfg.text}22`,
          }}
        >
          {stage ?? "단계 미지정"}
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
          gridTemplateColumns: "88px 1fr",
          rowGap: 6,
          columnGap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ color: "#94a3b8" }}>복원 시작일</div>
        <div style={{ fontWeight: 600 }}>{formatDate(startDate)}</div>

        <div style={{ color: "#94a3b8" }}>수심</div>
        <div style={{ fontWeight: 600 }}>
          {depth != null ? `${depth} m` : "-"}
        </div>

        <div style={{ color: "#94a3b8" }}>해역 유형</div>
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
            "linear-gradient(90deg, transparent, rgba(96,165,250,.5), rgba(167,139,250,.55), rgba(16,185,129,.55), transparent)",
          filter: "blur(.2px)",
        }}
      />

      {/* 자세히 보러가기 버튼 */}
      <div
        style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}
      >
        <button
          type="button"
          // onClick={() => { /* 연결할 로직 나중에 추가 */ }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 12,
            fontWeight: 600,
            color: "#e5e7eb",

            cursor: "pointer",
            transition:
              "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "inset 0 1px 0 rgba(255,255,255,.08), 0 10px 22px rgba(67,56,202,.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "inset 0 1px 0 rgba(255,255,255,.06), 0 6px 16px rgba(67,56,202,.25)";
          }}
        >
          <span>자세히 보러가기</span>
          {/* 화살표 아이콘 (SVG) */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
