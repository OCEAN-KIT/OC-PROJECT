"use client";

import { useAi } from "@/hooks/useAi";
import { useState } from "react";

export default function AiGeminiPage() {
  const [prompt, setPrompt] = useState("");
  const { response, isLoading, error, sendPrompt } = useAi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendPrompt(prompt, "gemini");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          AI
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="프롬프트를 입력하세요..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "전송 중..." : "전송"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {response && (
          <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              AI 응답
            </h3>
            <p className="text-gray-800 whitespace-pre-line">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
