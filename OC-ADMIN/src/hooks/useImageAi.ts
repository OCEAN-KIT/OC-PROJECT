import { aiImageAnalyze } from "@/api/ai";
import { useState } from "react";

export function useAiImage() {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendImage = async (image: File, prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await aiImageAnalyze(image, prompt);
      setResponse(res.data.content);
    } catch (err: unknown) {
      console.error("AI 이미지 분석 에러:", err);
      if (err instanceof Error) {
        setError(`이미지 분석 실패: ${err.message}`);
      } else {
        setError("이미지 분석 실패: 알 수 없는 오류");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { response, isLoading, error, sendImage };
}
