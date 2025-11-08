"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChatPost } from "@/api/chat";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, open]);

  const extractText = (res) => {
    if (!res) return "";
    return (
      res.answer ||
      res.message ||
      res.content ||
      res.text ||
      res.data ||
      (res.choices &&
        res.choices[0] &&
        res.choices[0].message &&
        res.choices[0].message.content) ||
      ""
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const text = msg.trim();
    if (!text || sending) return;

    const userMsg = {
      id:
        (typeof crypto !== "undefined" &&
          crypto.randomUUID &&
          crypto.randomUUID()) ||
        String(Date.now()),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setMsg("");
    setSending(true);

    try {
      const res = await ChatPost({ question: text });
      const botText = extractText(res) || "(응답이 비어있습니다)";
      const botMsg = {
        id:
          (typeof crypto !== "undefined" &&
            crypto.randomUUID &&
            crypto.randomUUID()) ||
          String(Date.now() + 1),
        role: "assistant",
        content: botText,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id:
          (typeof crypto !== "undefined" &&
            crypto.randomUUID &&
            crypto.randomUUID()) ||
          String(Date.now() + 2),
        role: "assistant",
        content:
          (err &&
            err.response &&
            err.response.data &&
            err.response.data.message) ||
          "요청 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        className="
          fixed bottom-6 right-6
          h-28 w-28 rounded-full
          shadow-lg ring-1 ring-black/10
          bg-white hover:bg-gray-50 active:scale-95 cursor-pointer
          flex items-center justify-center
          z-9999
        "
      >
        <Image
          src="/images/ocnChat.png"
          alt="Ocean Campus Chatbot"
          width={200}
          height={200}
          priority
        />
      </button>

      {/* 패널 */}
      {open && (
        <div
          className="fixed inset-0 z-9998 bg-black/30"
          onClick={() => setOpen(false)}
        >
          <div
            className="
              absolute bottom-38 right-6
              w-[360px] max-w-[90vw] h-[520px]
              bg-white/10 rounded-2xl shadow-2xl
              ring-1 ring-black/10
              text-gray-500
              flex flex-col  /* ✅ 세로 레이아웃 */
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="h-10 flex items-center justify-between px-4 border-b">
              <span className="text-sm font-medium">Ocean Campus 챗봇</span>
              <button
                className="text-xs text-gray-500"
                onClick={() => setOpen(false)}
              >
                닫기
              </button>
            </div>

            {/* 메시지 영역: 나머지 높이 차지 + 스크롤 */}
            <div className="flex-1 overflow-auto p-4 text-sm text-gray-700 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  메시지를 입력해 대화를 시작해 보세요.
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 whitespace-pre-wrap
                    ${
                      m.role === "user"
                        ? "bg-[#2F80ED] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-3 py-2 bg-gray-100 text-gray-600 rounded-bl-sm">
                    <span className="inline-block animate-pulse">
                      답변 작성 중…
                    </span>
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* 입력창: 패널의 맨 아래, absolute 제거 */}
            <form onSubmit={onSubmit} className="border-t bg-white/1 p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 "
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !msg.trim()}
                  className="rounded-lg bg-[#2F80ED] px-3 py-2 text-xs font-medium text-white  hover:brightness-105 disabled:opacity-50"
                >
                  보내기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
