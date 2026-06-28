import { MapPin } from "lucide-react";
import { useController } from "react-hook-form";
import type { SubmissionFormValues } from "../DiveFormProvider";
import { inputCls } from "../styles";

export default function SiteNameInput() {
  const { field } = useController<
    SubmissionFormValues,
    "basic.siteName"
  >({
    name: "basic.siteName",
  });

  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">현장명</h2>
        <span className="text-[11px] text-red-400 ml-auto">필수 입력</span>
      </div>

      <label className="block">
        <input
          ref={field.ref}
          className={inputCls}
          placeholder="울진 A 구역"
          value={field.value}
          onBlur={field.onBlur}
          onChange={field.onChange}
          autoComplete="off"
        />
      </label>
    </section>
  );
}
