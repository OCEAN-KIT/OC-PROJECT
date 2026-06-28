import DiveCreateContent from "@/components/dive-create/DiveCreateContent";
import { DiveFormProvider } from "@/components/dive-create/DiveFormProvider";

export default function DiveCreatePage() {
  return (
    <DiveFormProvider>
      <DiveCreateContent />
    </DiveFormProvider>
  );
}
