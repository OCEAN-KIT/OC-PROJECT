import { MapPin } from "lucide-react";
import { inputCls } from "../styles";

type SiteNameInputProps = {
  siteName: string;
  onChange: (next: string) => void;
};

export default function SiteNameInput({
  siteName,
  onChange,
}: SiteNameInputProps) {
  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">현장명</h2>
        <span className="text-[11px] text-red-400 ml-auto">필수 입력</span>
      </div>

      <label className="block">
        <input
          className={inputCls}
          placeholder="울진 A 구역"
          value={siteName}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
      </label>
    </section>
  );
}
