export const TABS = [
  { key: "overview", label: "개요" },
  { key: "status", label: "현황" },
  { key: "ecology", label: "생태 반응" },
  { key: "environment", label: "환경" },
  { key: "before-after", label: "복원 전/후" },
  { key: "timeline", label: "타임라인" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

type Props = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export default function TabsBar({ active, onChange }: Props) {
  return (
    <div className="relative">
      <div className="flex items-center gap-6 border-b border-white/10 px-5 pt-4 max-md:gap-5 max-md:overflow-x-auto max-md:whitespace-nowrap max-md:px-4 max-md:pt-3 scrollbar-hide">
        {TABS.map((t) => {
          const on = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "relative shrink-0 whitespace-nowrap pb-3 text-sm font-medium transition",
                on ? "text-indigo-50" : "text-indigo-100/55 hover:text-indigo-50",
              ].join(" ")}
            >
              {t.label}
              {on && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-indigo-200/90" />
              )}
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-indigo-950/45 to-transparent md:hidden" />
    </div>
  );
}
