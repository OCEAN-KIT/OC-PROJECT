import axiosInstance from "@/utils/axiosInstance";

export async function aiGroqPrompt(prompt: string) {
  const res = await axiosInstance.post("/api/ai/groq/complete", {
    prompt,
    temperature: 0.7,
    maxTokens: 512,
    useRealtime: true,
  });
  return res.data;
}

export async function harmfulnessChecker(sentence: string) {
  const res = await axiosInstance.post("/api/ai/groq/harmfulness", {
    sentence,
  });
  return res.data;
}

export async function aiGeminiPrompt(prompt: string) {
  const res = await axiosInstance.post("/api/ai/gemini/text/complete", {
    prompt,
  });
  return res.data;
}

export async function aiImageAnalyze(image: File, prompt: string) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("request", JSON.stringify({ prompt }));

  const res = await axiosInstance.post(
    "/api/ai/gemini/vision/describe",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
}
