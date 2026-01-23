"use client";

type Props<T extends string> = {
  options: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;

  columns?: number; // default 3
  getLabel?: (opt: T) => string;

  buttonClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
};

export default function MultiOptionGrid<T extends string>({
  options,
  value,
  onChange,
  columns = 3,
  getLabel,

  buttonClassName,
  activeButtonClassName,
  inactiveButtonClassName,
}: Props<T>) {
  const handleToggle = (opt: T) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => handleToggle(opt)}
            className={[
              "h-10 rounded-xl border text-[13px] font-semibold transition",
              active
                ? "border-sky-300 text-sky-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300",
              buttonClassName ?? "",
              active
                ? (activeButtonClassName ?? "")
                : (inactiveButtonClassName ?? ""),
            ].join(" ")}
          >
            {getLabel ? getLabel(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}
