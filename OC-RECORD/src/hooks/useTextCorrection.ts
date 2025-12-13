import { useCallback, useState } from "react";
import { aiGeminiPrompt } from "@/api/ai";

type GeminiCompleteResponse = {
  data?: { content?: string };
};

export function useTextCorrection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const correct = useCallback(async (sentence: string) => {
    setIsLoading(true);
    setError(null);

    const prompt = `"${sentence}" 맞춤법을 자연스럽게 다듬어줘. 설명 없이 결과 문장만 반환해. 참고로 이 문장은 해양 활동 기록에 쓰여.`;

    try {
      const res: GeminiCompleteResponse = await aiGeminiPrompt(prompt);
      const content = res?.data?.content;
      return typeof content === "string" ? content : null;
    } catch (err) {
      console.error("[ai] sentence correct failed", err);
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { correct, isLoading, error };
}
