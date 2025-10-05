"use client";

import Image from "next/image";
import { useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { useAiImage } from "@/hooks/useImageAi";

export default function VisionPage() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const { response, isLoading, error, sendImage } = useAiImage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("이미지를 업로드하세요.");
      return;
    }
    await sendImage(image, prompt);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">이미지 분석 AI</h1>

      {/* 업로드 폼 */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-gray-200 rounded-xl p-4 shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            이미지 업로드
          </label>

          {/* input 숨기고 label을 버튼으로 */}
          <label className="flex items-center gap-2 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50">
            <AiOutlineUpload className="text-xl text-gray-600" />
            <span className="text-gray-700">클릭해서 이미지 선택</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {image && (
            <Image
              src={URL.createObjectURL(image)}
              alt="preview"
              width={0}
              height={0}
              style={{ width: "300px", height: "auto" }}
              className="mt-3 rounded-lg shadow"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">프롬프트</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 이 사진의 주요 특징을 설명해줘"
            className="w-full border border-gray-200 rounded-lg p-2 h-24"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "분석 중..." : "분석하기"}
        </button>
      </form>

      {/* 결과 출력 */}
      {error && (
        <div className="border border-red-200 text-red-700 rounded-xl p-4 bg-red-50">
          {error}
        </div>
      )}

      {response && (
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">분석 결과</h2>
          <p className="text-gray-700 whitespace-pre-line">{response}</p>
        </div>
      )}
    </div>
  );
}
