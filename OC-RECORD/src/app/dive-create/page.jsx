// app/dive-create/page.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock3,
  MapPin,
  Gauge,
  Waves,
  Eye,
  ClipboardList,
  Images,
  Plus,
  Check,
  Activity,
  TrendingUp,
  Percent,
} from "lucide-react";

import { uploadImage } from "@/api/upload-image";
import { createSubmission } from "@/api/submissions";
import {
  generateDraftId,
  getDraftById,
  upsertDraft,
} from "@/utils/diveDraftStorage";
import CheonjiinKeyboard from "@/components/keyboard/CheonjiinKeyboard";
import { ClipLoader } from "react-spinners";
import { useTextCorrection } from "@/hooks/useTextCorrection";

const DEBUG = true;
const TEST_NO_ATTACH = false;

/** S3 key -> public URL (뷰에서만 사용; 서버 저장은 key만) */
const keyToPublicUrl = (key) => {
  const base = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE || "";
  const cleanBase = base.replace(/\/+$/, "");
  const cleanKey = String(key || "").replace(/^\/+/, "");
  return cleanBase ? `${cleanBase}/${cleanKey}` : `/${cleanKey}`;
};

const n = (v, fb = 0) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : fb;
};

const pad = (num, len = 2) => String(num).padStart(len, "0");
const toLocalDateTimeString = (d) => {
  const date = typeof d === "string" ? new Date(d) : d;
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  const ms = pad(date.getMilliseconds(), 3);
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}.${ms}`;
};

function labelToActivityType(label) {
  switch (label) {
    case "이식":
      return "TRANSPLANT";
    case "폐기물 수거":
      return "TRASH_COLLECTION";
    case "성게 제거":
      return "URCHIN_REMOVAL";
    case "연구":
      return "RESEARCH";
    case "모니터링":
      return "MONITORING";
    case "기타":
      return "OTHER";
  }
}

const WORK_TYPES = [
  "이식",
  "폐기물 수거",
  "성게 제거",
  "연구",
  "모니터링",
  "기타",
];

export default function DiveCreatePage() {
  const router = useRouter();

  const [draftId, setDraftId] = useState(null);
  const initializedRef = useRef(false);

  // ========= 공통 스타일 =========
  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-gray-800 placeholder:text-gray-400 focus:ring-4 focus:ring-sky-100 focus:border-sky-300 transition";
  const cardCls =
    "rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-4";
  const labelCls = "text-[13px] text-gray-500 mb-1.5";

  // ========= 1) 환경 정보 상태 =========
  const [siteName, setSiteName] = useState("");

  // 날짜/시간 → 현재 값으로 기본 세팅
  const [date, setDate] = useState(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${MM}-${dd}`;
  });
  const [time, setTime] = useState(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  });

  const [depth, setDepth] = useState("");
  const [temp, setTemp] = useState("");
  const [current, setCurrent] = useState("중간"); // 잔잔/중간/강함
  const [visibility, setVisibility] = useState("");

  // ========= 2) 모니터링(3번) 관련 상태 =========
  // 건강 상태: A/B/C/D
  const [healthGrade, setHealthGrade] = useState("A");

  // 성장률(cm)
  const [growthCm, setGrowthCm] = useState("");

  // 자연 번식률: 조사 반경 + (번식 개체 / 조사 개체) 형태
  const [natRadiusM, setNatRadiusM] = useState("");
  const [natNumerator, setNatNumerator] = useState(""); // 번식 개체 수
  const [natDenominator, setNatDenominator] = useState(""); // 조사 개체 수

  // 생존률: (생존 로프 개수 / 전체 로프 개수)
  const [survAlive, setSurvAlive] = useState("");
  const [survTotal, setSurvTotal] = useState("");

  const natPercent = useMemo(() => {
    const num = Number(natNumerator);
    const den = Number(natDenominator);
    if (!den || !Number.isFinite(num)) return 0;
    return Math.round((num / den) * 100);
  }, [natNumerator, natDenominator]);

  const survivalPercent = useMemo(() => {
    const total = Number(survTotal);
    const dead = Number(survAlive); // <- 이제 죽은 로프 개수로 사용

    if (!total || !Number.isFinite(total) || total <= 0) return 0;

    const alive = Math.max(total - (Number.isFinite(dead) ? dead : 0), 0);
    return Math.round((alive / total) * 100);
  }, [survTotal, survAlive]);

  const aliveCount = useMemo(() => {
    const total = Number(survTotal);
    const dead = Number(survAlive);

    if (!Number.isFinite(total) || total <= 0) return 0;
    if (!Number.isFinite(dead) || dead < 0) return total;

    return Math.max(total - dead, 0);
  }, [survTotal, survAlive]);

  // ========= 3) 활동/내용/첨부 상태 =========
  const [workType, setWorkType] = useState("이식");
  const [details, setDetails] = useState("");
  const DETAILS_MAX = 2000;
  const {
    correct: runSentenceCorrection,
    isLoading: correctingSentence,
  } = useTextCorrection();

  const [attachments, setAttachments] = useState([]);
  const fileRef = useRef(null);

  const keyboardBaseRef = useRef("");

  // ========= 8) 최초 진입 시 draftId 결정 + 기존 임시저장 로딩 =========
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);
    const fromParam = sp.get("draftId");

    if (fromParam) {
      setDraftId(fromParam);
      const existing = getDraftById(fromParam);
      if (existing) {
        if (DEBUG) console.log("[draft] load existing draft =", existing);

        setSiteName(existing.siteName || "");
        setDate(existing.date || date);
        setTime(existing.time || time);
        setDepth(existing.depth ?? "");
        setTemp(existing.temp ?? "");
        setCurrent(existing.current || "중간");
        setVisibility(existing.visibility ?? "");
        setHealthGrade(existing.healthGrade || "A");
        setGrowthCm(existing.growthCm ?? "");
        setNatRadiusM(existing.natRadiusM ?? "");
        setNatNumerator(existing.natNumerator ?? "");
        setNatDenominator(existing.natDenominator ?? "");
        setSurvAlive(existing.survAlive ?? "");
        setSurvTotal(existing.survTotal ?? "");
        setDetails(existing.details ?? "");
      }
    } else {
      const freshId = generateDraftId();
      if (DEBUG) console.log("[draft] new draft id =", freshId);
      setDraftId(freshId);
    }
  }, []); // ✅ 의존성 배열 비움

  // ========= 4) 디바이스 특성 =========
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  // ========= 5) 천지인 키보드 활성 필드 =========
  // 이제 "details"만 천지인 사용
  // "details" | null
  const [activeField, setActiveField] = useState();

  // refs
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const detailsRef = useRef(null);
  const keyboardRef = useRef(null);

  // ========= 6) 헬퍼들 =========
  const openDatePicker = () => {
    const el = dateInputRef.current;
    if (el && typeof el.showPicker === "function") el.showPicker();
    else {
      const v = prompt("날짜 (YYYY-MM-DD)", date);
      if (v) setDate(v);
    }
  };

  const openTimePicker = () => {
    const el = timeInputRef.current;
    if (el && typeof el.showPicker === "function") el.showPicker();
    else {
      const v = prompt("시간 (HH:MM)", time);
      if (v) setTime(v);
    }
  };

  const toTimeObj = (hhmm) => {
    const [h = "0", m = "0"] = (hhmm || "").split(":");
    return { hour: Number(h) || 0, minute: Number(m) || 0, second: 0, nano: 0 };
  };

  const mapCurrent = (label) => {
    switch (label) {
      case "잔잔":
        return "LOW";
      case "강함":
        return "HIGH";
      case "중간":
      default:
        return "MEDIUM";
    }
  };

  const toHHMMSS = (t) => {
    if (!t) return "00:00:00";
    const pad2 = (x) => String(Number(x) || 0).padStart(2, "0");
    return `${pad2(t.hour)}:${pad2(t.minute)}:${pad2(t.second)}`;
  };

  // ========= 7) 천지인 키보드 입력 처리 =========
  const handleKeyboardChange = (sessionText) => {
    if (activeField !== "details") return;
    const base = keyboardBaseRef.current ?? "";
    const merged = (base + sessionText).slice(0, DETAILS_MAX);
    setDetails(merged);
  };

  const handleSentenceCorrect = async () => {
    const target = details.trim();
    if (!target || correctingSentence) return;

    const corrected = await runSentenceCorrection(target);
    if (corrected) {
      setDetails(corrected);
      keyboardBaseRef.current = corrected;
    } else {
      alert("문장 보정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 바깥 클릭 시 키보드 닫기
  useEffect(() => {
    if (!activeField) return;

    const handleClickOutside = (e) => {
      if (
        detailsRef.current?.contains(e.target) ||
        keyboardRef.current?.contains(e.target)
      ) {
        return;
      }
      setActiveField(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [activeField]);

  // ========= 8) 임시 저장용 draft 객체 =========
  const saveDraftObject = () => {
    // 좌표는 일단 0,0으로 고정
    const latitude = 0;
    const longitude = 0;

    const draft = {
      siteName: siteName.trim() || "Unknown Site",
      recordDate: date,
      startTime: toTimeObj(time),
      endTime: toTimeObj(time),
      latitude,
      longitude,
      depthM: Number(depth) || 0,
      waterTempC: Number(temp) || 0,
      visibilityM: Number(visibility) || 0,
      currentState: mapCurrent(current),
      weather: "SUNNY",

      // 🔹 3번: 추후 백엔드로 바로 보낼 수 있게 구조만 잡아둠 (아직 API에는 안 씀)
      monitoring: {
        healthGrade,
        growthCm: Number(growthCm) || 0,
        naturalReproduction: {
          radiusM: Number(natRadiusM) || 0,
          numerator: Number(natNumerator) || 0,
          denominator: Number(natDenominator) || 0,
          percent: natPercent || 0,
        },
        survival: {
          aliveCount: Number(survAlive) || 0,
          totalCount: Number(survTotal) || 0,
          percent: survivalPercent || 0,
        },
      },
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("diveDraft", JSON.stringify(draft));
    }
    return draft;
  };

  const handleSaveDraft = () => {
    // 백엔드용 env/monitoring draft는 기존처럼 sessionStorage에도 저장
    const envDraft = saveDraftObject();

    // UI 상태 기반으로 "임시저장 카드"에 쓸 데이터 만들기
    const nowIso = new Date().toISOString();

    // 일단 현재 폼 값들로 baseDraft 구성
    const baseDraft = {
      id: draftId || generateDraftId(),
      siteName: siteName.trim() || "Unknown Site",
      date,
      time,
      depth,
      temp,
      current,
      visibility,
      healthGrade,
      growthCm,
      natRadiusM,
      natNumerator,
      natDenominator,
      survAlive,
      survTotal,
      details,
      updatedAt: nowIso,
    };

    // 기존 draft가 있으면 가져와서 createdAt 유지 + 필드만 덮어쓰기
    const existing = draftId ? getDraftById(draftId) : null;
    const finalDraft = existing
      ? { ...existing, ...baseDraft, createdAt: existing.createdAt }
      : { ...baseDraft, createdAt: nowIso };

    // 새로 생성하는 경우라면 draftId state도 세팅해주기
    if (!draftId) {
      setDraftId(finalDraft.id);
    }

    // localStorage 에 upsert
    upsertDraft(finalDraft);

    if (DEBUG) {
      console.log("[draft] env & monitoring (sessionStorage):", envDraft);
      console.log("[draft] ui draft upserted:", finalDraft);
      console.log("[draft] attachments count:", attachments.length);
    }

    alert("임시 저장했습니다.");
  };

  // ========= 9) 첨부 핸들링 =========
  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const next = [...attachments, ...files].slice(0, 10);
    setAttachments(next);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeOne = (idx) =>
    setAttachments((prev) => prev.filter((_, i) => i !== idx));

  // 예전처럼 "작업내용/첨부 없으면 제출 불가" 로직 제거
  // → 항상 제출 가능, 빈값은 0/빈 문자열로 전송
  const [loading, setLoading] = useState(false);
  // ========= 10) 제출 =========
  async function handleSubmit() {
    setLoading(true);
    try {
      const d = saveDraftObject(); // 현재 환경 + 모니터링 값 기반 draft 재생성
      if (DEBUG) console.log("[submit] env & monitoring draft =", d);

      // 첨부 업로드
      let uploaded = [];
      if (!TEST_NO_ATTACH) {
        for (const f of attachments) {
          const key = await uploadImage(f); // presigned PUT
          if (DEBUG)
            console.log("[upload] done =>", {
              key,
              preview: keyToPublicUrl(key),
            });
          uploaded.push({
            fileName: f.name,
            fileUrl: key,
            mimeType: f.type,
            fileSize: n(f.size),
          });
        }
      }

      const apiType = labelToActivityType(workType);
      const detailsCombined = details || ""; // 비어 있으면 빈 문자열

      // 🔹 추가: monitoring에서 숫자/필드 꺼내기
      const mon = d.monitoring ?? {};
      const nat = mon.naturalReproduction ?? {};
      const surv = mon.survival ?? {};

      const alive = n(surv.aliveCount, 0);
      const total = n(surv.totalCount, 0);
      const dieCount = total > alive ? total - alive : 0;

      const payload = {
        siteName: d.siteName || "Unknown Site",
        activityType: apiType,
        submittedAt: toLocalDateTimeString(new Date()),
        authorName: "string",
        authorEmail: "string",
        feedbackText: "",
        latitude: n(d.latitude),
        longitude: n(d.longitude),

        basicEnv: {
          recordDate: d.recordDate ?? new Date().toISOString().slice(0, 10),
          startTime: toHHMMSS(d.startTime),
          endTime: toHHMMSS(d.endTime ?? d.startTime),
          waterTempC: n(d.waterTempC),
          visibilityM: n(d.visibilityM),
          depthM: n(d.depthM),
          currentState: d.currentState || "LOW",
          weather: d.weather || "SUNNY",
        },

        participants: {
          leaderName: "김다이버",
          participantCount: 1,
          role: "CITIZEN_DIVER",
        },

        activity: {
          type: apiType,
          details: detailsCombined,
          collectionAmount: 0,
          durationHours: 0,

          // 🔹 여기부터 새 필드 4개
          healthGrade: mon.healthGrade || "A",
          growthCm: n(mon.growthCm, 0),
          naturalReproduction: {
            radiusM: n(nat.radiusM, 0),
            numerator: n(nat.numerator, 0),
            denominator: n(nat.denominator, 0),
          },
          survival: {
            dieCount,
            totalCount: total,
          },
        },

        attachments: uploaded,
      };

      if (DEBUG) {
        console.log("[submit] payload =", JSON.stringify(payload, null, 2));
        console.log("[submit] monitoring (local only for now) =", d.monitoring);
      }

      const res = await createSubmission(payload);
      console.log("[submit] response =", res);
      setLoading(false);
      alert("제출 완료!");
      router.replace("/home");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error("[submit] ERROR status =", status);
      console.error("[submit] ERROR body   =", JSON.stringify(data, null, 2));
      alert(
        status === 500
          ? "서버 500 : 콘솔 로그 확인"
          : `제출 실패: ${status ?? ""}`
      );
    } finally {
      setLoading(false);
    }
  }

  // ========= 11) JSX =========
  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-b from-gray-50 to-white">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-[420px] px-4 h-14 flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl p-1.5 hover:bg-gray-100 active:scale-[0.98] transition"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-[16px] font-semibold tracking-tight">
            활동 제출
          </h1>
        </div>
      </header>

      {/* 본문 */}
      <main className="mx-auto max-w-[420px] px-4 pt-4 pb-40 space-y-4">
        {/* ===== 환경 정보 섹션들 ===== */}

        {/* 사이트명 (기본 키보드) */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">현장명</h2>
          </div>
          <label className="block">
            <input
              className={inputCls}
              placeholder="울진 A 구역"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              autoComplete="off"
            />
          </label>
        </section>

        {/* 날짜/시간 */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">
              날짜/시간
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* 날짜 */}
            <button
              type="button"
              onClick={!isMobile ? openDatePicker : undefined}
              className="relative text-left"
            >
              <div className={cardCls + " p-3"}>
                <div className="text-[12px] text-gray-500 mb-1">날짜</div>
                <div className="flex items-center gap-2 text-[15px] text-gray-800">
                  <CalendarIcon className="h-4 w-4 shrink-0" />
                  <span>{date}</span>
                </div>
                <div className="mt-2 text-[12px] text-sky-600 font-medium">
                  변경
                </div>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={
                    isMobile
                      ? "absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      : "absolute right-2 top-2 h-0 w-0 opacity-0 pointer-events-none"
                  }
                  inputMode="none"
                />
              </div>
            </button>

            {/* 시간 */}
            <button
              type="button"
              onClick={!isMobile ? openTimePicker : undefined}
              className="relative text-left"
            >
              <div className={cardCls + " p-3"}>
                <div className="text-[12px] text-gray-500 mb-1">시간</div>
                <div className="flex items-center gap-2 text-[15px] text-gray-800">
                  <Clock3 className="h-4 w-4 shrink-0" />
                  <span>{time}</span>
                </div>
                <div className="mt-2 text-[12px] text-sky-600 font-medium">
                  변경
                </div>
                <input
                  ref={timeInputRef}
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={
                    isMobile
                      ? "absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      : "absolute right-2 top-2 h-0 w-0 opacity-0 pointer-events-none"
                  }
                  step="60"
                  inputMode="none"
                />
              </div>
            </button>
          </div>
        </section>

        {/* 작업 유형 */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">
              작업 유형
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {WORK_TYPES.map((opt) => {
              const active = workType === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setWorkType(opt)}
                  className={[
                    "h-10 rounded-xl text-[13px] font-semibold transition",
                    active
                      ? "bg-white border border-sky-200 text-sky-700 ring-2 ring-sky-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  ].join(" ")}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </section>

        {/* 수심/수온 */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">
              수심 / 수온
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="relative block">
              <span className={labelCls}>수심</span>
              <input
                className={inputCls + " pr-12"}
                placeholder="예: 8.5"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                inputMode="decimal" // ✅ 모바일 숫자 키패드 유도
              />
              <span className="pointer-events-none absolute right-3 top-[38px] text-gray-500 select-none">
                M
              </span>
            </label>

            <label className="relative block">
              <span className={labelCls}>수온</span>
              <input
                className={inputCls + " pr-12"}
                placeholder="예: 18.2"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                inputMode="decimal"
              />
              <span className="pointer-events-none absolute right-3 top-[38px] text-gray-500 select-none">
                °C
              </span>
            </label>
          </div>
        </section>

        {/* 조류 */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-2">
            <Waves className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">조류</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["잔잔", "중간", "강함"].map((opt) => {
              const active = current === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCurrent(opt)}
                  className={[
                    "h-10 rounded-xl font-semibold text-[13px] transition",
                    active
                      ? "bg-white border border-sky-200 text-sky-700 ring-2 ring-sky-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  ].join(" ")}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </section>

        {/* 시야 */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">시야</h2>
          </div>
          <label className="relative block">
            <input
              className={inputCls + " pr-12"}
              placeholder="예: 4.0"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              inputMode="decimal"
            />
            <span className="pointer-events-none absolute right-3 top-[15px] text-gray-500 select-none">
              M
            </span>
          </label>
        </section>

        {/* ===== 3번: 건강 상태 / 성장률 / 자연번식률 / 생존률 섹션 ===== */}

        {/* 건강 상태 */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">
              건강 상태
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["A", "B", "C", "D"].map((grade) => {
              const active = healthGrade === grade;
              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setHealthGrade(grade)}
                  className={[
                    "h-10 rounded-xl text-[14px] font-semibold transition",
                    active
                      ? "bg-white border border-emerald-200 text-emerald-700 ring-2 ring-emerald-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  ].join(" ")}
                >
                  {grade}
                </button>
              );
            })}
          </div>
        </section>

        {/* 성장률 */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">
              성장률 (길이 증가)
            </h2>
          </div>
          <label className="relative block">
            <input
              className={inputCls + " pr-12"}
              placeholder="예: 3.5"
              value={growthCm}
              onChange={(e) => setGrowthCm(e.target.value)}
              inputMode="decimal"
            />
            <span className="pointer-events-none absolute right-3 top-[15px] text-gray-500 select-none">
              cm
            </span>
          </label>
        </section>

        {/* 자연 번식률 */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">
              자연 번식률
            </h2>
          </div>

          <div className="grid gap-3">
            <label className="block">
              <span className={labelCls}>조사 반경 (예: 50m / 100m)</span>
              <div className="relative">
                <input
                  className={inputCls + " pr-10"}
                  placeholder="예: 50"
                  value={natRadiusM}
                  onChange={(e) => setNatRadiusM(e.target.value)}
                  inputMode="numeric"
                />
                <span className="pointer-events-none absolute right-3 top-[10px] text-gray-500 select-none">
                  m
                </span>
              </div>
            </label>

            {/* 분자/분모 형태 입력 */}
            <div>
              <div className="flex items-end gap-8">
                <div className="flex flex-col items-center gap-1">
                  <input
                    className="w-32 h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-[15px] outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
                    placeholder="번식 개체"
                    value={natNumerator}
                    onChange={(e) => setNatNumerator(e.target.value)}
                    inputMode="numeric"
                  />
                  <div className="my-1 h-px w-20 bg-gray-300" />
                  <input
                    className="w-32 h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-[15px] outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
                    placeholder="조사 개체"
                    value={natDenominator}
                    onChange={(e) => setNatDenominator(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <div className="text-[13px] text-gray-500 leading-relaxed">
                  번식률{" "}
                  <span className="font-semibold text-gray-800">
                    {natPercent || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 생존률 */}
        <section className={cardCls}>
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-sky-600 rotate-90" />
            <h2 className="text-[14px] font-semibold text-gray-800">생존률</h2>
          </div>
          <p className="mb-2 text-[11px] text-gray-400">
            전체 로프 개수와 죽은 로프 개수를 입력하면 생존 로프와 생존률이 자동
            계산됩니다.
          </p>

          <div className="space-y-3">
            {/* 입력 영역 */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>전체 로프</span>
                <input
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-[15px] outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
                  placeholder="예: 10"
                  value={survTotal}
                  onChange={(e) => setSurvTotal(e.target.value)}
                  inputMode="numeric"
                />
              </label>

              <label className="block">
                <span className={labelCls}>죽은 로프</span>
                <input
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-[15px] outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
                  placeholder="예: 3"
                  value={survAlive} // <- 이제 죽은 로프 개수
                  onChange={(e) => setSurvAlive(e.target.value)}
                  inputMode="numeric"
                />
              </label>
            </div>

            {/* 결과 표시 */}
            <div className="flex items-center justify-between text-[13px] text-gray-600">
              <div>
                총 생존 로프{" "}
                <span className="font-semibold text-gray-800">
                  {aliveCount || 0}개
                </span>
              </div>
              <div>
                생존률{" "}
                <span className="font-semibold text-gray-800">
                  {survivalPercent || 0}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 활동 / 내용 / 첨부 섹션들 ===== */}

        {/* 작업 내용 (천지인) */}
        <section className={cardCls}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-sky-600" />
              <h2 className="text-[14px] font-semibold text-gray-800">
                작업 내용
              </h2>
            </div>
            <button
              type="button"
              className="text-[12px] text-sky-600 hover:text-sky-700 disabled:text-gray-300 disabled:cursor-not-allowed"
              onClick={handleSentenceCorrect}
              disabled={!details.trim() || correctingSentence}
            >
              {correctingSentence ? (
                <ClipLoader size={14} color="#0284c7" />
              ) : (
                "문장 보정"
              )}
            </button>
          </div>
          <label className="block">
            <textarea
              ref={detailsRef}
              className={`${inputCls} h-44 resize-none`}
              placeholder="메시지를 입력해 주세요."
              value={details}
              onClick={() => {
                keyboardBaseRef.current = details; // ✅ 현재 내용 스냅샷으로 저장
                setActiveField("details");
              }}
              onFocus={() => {
                keyboardBaseRef.current = details; // 포커스로 열릴 때도 동일 처리
                setActiveField("details");
              }}
              onChange={(e) => {
                const next = e.target.value.slice(0, DETAILS_MAX);
                setDetails(next);
                keyboardBaseRef.current = next;
              }}
            />
          </label>
        </section>

        {/* 첨부 */}
        <section className={cardCls}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Images className="h-4 w-4 text-sky-600" />
              <h2 className="text-[14px] font-semibold text-gray-800">
                활동 사진 및 동영상
              </h2>
            </div>
            <span className="text-[12px] text-gray-400">
              {attachments.length}/10
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
                    onClick={() => removeOne(idx)}
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

        <div className="mx-auto max-w-[420px] py-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="h-12 rounded-xl bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 active:translate-y-[1px]"
          >
            임시 저장
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="h-12 rounded-xl bg-[#2F80ED] text-white font-semibold hover:brightness-105 active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "제출하기"}
          </button>
        </div>
      </main>

      {/* ✅ 하단 천지인 키보드 (바텀시트 느낌, 작업 내용 전용) */}
      {activeField && (
        <div
          ref={keyboardRef}
          className="fixed left-1/2 bottom-0 z-20 -translate-x-1/2 w-full max-w-[420px]"
        >
          <div className="mx-auto max-w-[420px]">
            <CheonjiinKeyboard onChange={handleKeyboardChange} />
          </div>
        </div>
      )}
    </div>
  );
}
