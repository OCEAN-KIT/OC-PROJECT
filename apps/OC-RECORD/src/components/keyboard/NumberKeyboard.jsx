// NumberKeyboard.jsx
export default function NumberKeyboard({
  onInsertChar,
  onBackspace,
  goHangulMode,
  goEnglishMode,
  goSymbolMode,
}) {
  return (
    <div>
      {/* ✅ 1행: 모드 버튼 (다른 키보드랑 완전 동일 스타일) */}
      <div className="cheon-grid">
        <button className="cheon-key cheon-key--mode" onClick={goHangulMode}>
          한글
        </button>
        <button className="cheon-key cheon-key--mode" onClick={goEnglishMode}>
          영타
        </button>
        <button className="cheon-key cheon-key--mode cheon-key--mode-active">
          123
        </button>
        <button className="cheon-key cheon-key--mode" onClick={goSymbolMode}>
          기호
        </button>
      </div>

      {/* ✅ 아래 숫자패드: 789 / 456 / 123 / SPACE 0 ⌫ (3×4, 빈칸 없음) */}
      <div className="cheon-grid cheon-grid--number">
        {/* 1줄: 7 8 9 */}
        <button className="cheon-key" onClick={() => onInsertChar("7")}>
          7
        </button>
        <button className="cheon-key" onClick={() => onInsertChar("8")}>
          8
        </button>
        <button className="cheon-key" onClick={() => onInsertChar("9")}>
          9
        </button>

        {/* 2줄: 4 5 6 */}
        <button className="cheon-key" onClick={() => onInsertChar("4")}>
          4
        </button>
        <button className="cheon-key" onClick={() => onInsertChar("5")}>
          5
        </button>
        <button className="cheon-key" onClick={() => onInsertChar("6")}>
          6
        </button>

        {/* 3줄: 1 2 3 */}
        <button className="cheon-key" onClick={() => onInsertChar("1")}>
          1
        </button>
        <button className="cheon-key" onClick={() => onInsertChar("2")}>
          2
        </button>
        <button className="cheon-key" onClick={() => onInsertChar("3")}>
          3
        </button>

        {/* 4줄: SPACE 0 ⌫ */}
        <button className="cheon-key" onClick={() => onInsertChar(" ")}>
          SPACE
        </button>
        <button className="cheon-key" onClick={() => onInsertChar("0")}>
          0
        </button>
        <button className="cheon-key cheon-key--func" onClick={onBackspace}>
          ⌫
        </button>
      </div>
    </div>
  );
}
