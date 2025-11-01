import { harmfulnessChecker } from "@/api/ai";
import { useState } from "react";

export function useHarmfulness() {
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPrompt = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await harmfulnessChecker(prompt);
      setScore(res.data.degree);
      setIsLoading(false);
    } catch (err: unknown) {
      console.error("AI 호출 에러:", err);
      setIsLoading(false);
      if (err instanceof Error) {
        setError(`AI 호출 실패: ${err.message}`);
        setIsLoading(false);
      } else {
        setError("AI 호출 실패: 알 수 없는 오류");
        setIsLoading(false);
      }
    }
  };

  return { score, isLoading, error, sendPrompt };
}
