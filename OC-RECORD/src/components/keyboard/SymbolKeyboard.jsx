// SymbolKeyboard.jsx
export default function SymbolKeyboard({
  onInsertChar,
  onBackspace,
  goHangulMode,
  goEnglishMode,
  goNumberMode,
}) {
  return (
    <div className="cheon-grid">
      {/* 1행: 모드 공통 */}
      <button className="cheon-key cheon-key--mode" onClick={goHangulMode}>
        한글
      </button>
      <button className="cheon-key cheon-key--mode" onClick={goEnglishMode}>
        영타
      </button>
      <button className="cheon-key cheon-key--mode" onClick={goNumberMode}>
        123
      </button>
      <button className="cheon-key cheon-key--mode cheon-key--mode-active">
        기호
      </button>

      {/* 2행: @ # & ⌫ */}
      <button className="cheon-key" onClick={() => onInsertChar("@")}>
        @
      </button>
      <button className="cheon-key" onClick={() => onInsertChar("#")}>
        #
      </button>
      <button className="cheon-key" onClick={() => onInsertChar("&")}>
        &
      </button>
      <button className="cheon-key cheon-key--func" onClick={onBackspace}>
        ⌫
      </button>

      {/* 3행: ( ) [ ] */}
      <button className="cheon-key" onClick={() => onInsertChar("(")}>
        (
      </button>
      <button className="cheon-key" onClick={() => onInsertChar(")")}>
        )
      </button>
      <button className="cheon-key" onClick={() => onInsertChar("[")}>
        [
      </button>
      <button className="cheon-key" onClick={() => onInsertChar("]")}>
        ]
      </button>

      {/* 4행: { } " ' */}
      <button className="cheon-key" onClick={() => onInsertChar("{")}>
        {"{"}
      </button>
      <button className="cheon-key" onClick={() => onInsertChar("}")}>
        {"}"}
      </button>
      <button className="cheon-key" onClick={() => onInsertChar('"')}>
        "
      </button>
      <button className="cheon-key" onClick={() => onInsertChar("'")}>
        '
      </button>

      {/* 5행: , . ! ↵ */}
      <button className="cheon-key" onClick={() => onInsertChar(",")}>
        ,
      </button>
      <button className="cheon-key" onClick={() => onInsertChar(".")}>
        .
      </button>
      <button className="cheon-key" onClick={() => onInsertChar("!")}>
        !
      </button>
      <button
        className="cheon-key cheon-key--enter"
        onClick={() => onInsertChar("\n")}
      >
        ↵
      </button>
    </div>
  );
}
