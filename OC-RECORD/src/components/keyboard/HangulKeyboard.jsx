// HangulKeyboard.jsx
export default function HangulKeyboard({
  onStroke,
  onConsonantGroup,
  onInsertChar,
  onInsertCharCycle,
  onBackspace,
  goEnglishMode,
  goNumberMode,
  goSymbolMode,
}) {
  return (
    <div className="cheon-grid">
      {/* 1행: 모드 버튼 (한글 / 영타 / 123 / 기호) */}
      <button className="cheon-key cheon-key--mode cheon-key--mode-active">
        한글
      </button>
      <button className="cheon-key cheon-key--mode" onClick={goEnglishMode}>
        영타
      </button>
      <button className="cheon-key cheon-key--mode" onClick={goNumberMode}>
        123
      </button>
      <button className="cheon-key cheon-key--mode" onClick={goSymbolMode}>
        기호
      </button>

      {/* 2행: ㅣ · ㅡ ⌫ */}
      <button className="cheon-key" onClick={() => onStroke("I")}>
        ㅣ
      </button>
      <button className="cheon-key" onClick={() => onStroke("D")}>
        ·
      </button>
      <button className="cheon-key" onClick={() => onStroke("H")}>
        ㅡ
      </button>
      <button className="cheon-key cheon-key--func" onClick={onBackspace}>
        ⌫
      </button>

      {/* 3행: ㄱㅋ / ㄴㄹ / ㄷㅌ / ?! */}
      <button
        className="cheon-key"
        onClick={() => onConsonantGroup(["ㄱ", "ㅋ", "ㄲ"])}
      >
        ㄱㅋ
      </button>
      <button
        className="cheon-key"
        onClick={() => onConsonantGroup(["ㄴ", "ㄹ"])}
      >
        ㄴㄹ
      </button>
      <button
        className="cheon-key"
        onClick={() => onConsonantGroup(["ㄷ", "ㅌ", "ㄸ"])}
      >
        ㄷㅌ
      </button>
      <button
        className="cheon-key"
        onClick={() => onInsertCharCycle(["?", "!"])}
      >
        ?!
      </button>

      {/* 4행: ㅂㅍ / ㅅㅎ / ㅈㅊ / ↵ */}
      <button
        className="cheon-key"
        onClick={() => onConsonantGroup(["ㅂ", "ㅍ", "ㅃ"])}
      >
        ㅂㅍ
      </button>
      <button
        className="cheon-key"
        onClick={() => onConsonantGroup(["ㅅ", "ㅎ", "ㅆ"])}
      >
        ㅅㅎ
      </button>
      <button
        className="cheon-key"
        onClick={() => onConsonantGroup(["ㅈ", "ㅊ", "ㅉ"])}
      >
        ㅈㅊ
      </button>
      <button
        className="cheon-key cheon-key--enter"
        onClick={() => onInsertChar("\n")}
      >
        ↵
      </button>

      {/* 5행: . , / ㅇㅁ / SPACE(2칸) */}
      <button
        className="cheon-key"
        onClick={() => onInsertCharCycle([".", ","])}
      >
        . ,
      </button>
      <button
        className="cheon-key"
        onClick={() => onConsonantGroup(["ㅇ", "ㅁ"])}
      >
        ㅇㅁ
      </button>
      <button
        className="cheon-key cheon-key--space"
        onClick={() => onInsertChar(" ")}
      >
        SPACE
      </button>
    </div>
  );
}
