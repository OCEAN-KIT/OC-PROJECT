import axios from "axios";

const GATEWAY_KEY = process.env.NEXT_PUBLIC_GATEWAY_KEY ?? "our_gateway_key";
// 가능하면 서버 전용 env(예: process.env.GATEWAY_KEY)로 보관하세요.

export async function ChatPost({ question }) {
  const res = await axios.post(
    "https://www.jungjiyu.com/ai/chat",
    {
      question,
      model: "ocean",
      temperature: 0.3,
      stream: false,
      max_tokens: 768,
    },
    {
      headers: {
        Authorization: `Bearer ${GATEWAY_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}
