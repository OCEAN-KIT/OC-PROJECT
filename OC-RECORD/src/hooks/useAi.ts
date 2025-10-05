import { useState } from "react";
import { aiGroqPrompt } from "@/api/ai";
import { aiGeminiPrompt } from "@/api/ai";

export function useAi() {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPrompt = async (prompt: string, model: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (model === "groq") {
        const res = await aiGroqPrompt(prompt);
        setResponse(res.data.content);
        setIsLoading(false);
      } else if (model === "gemini") {
        const res = await aiGeminiPrompt(prompt);
        setResponse(res.data.content);
        setIsLoading(false);
      }
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
  return { response, isLoading, error, sendPrompt };
}
