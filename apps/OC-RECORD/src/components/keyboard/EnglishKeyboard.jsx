// EnglishKeyboard.jsx
export default function EnglishKeyboard({
  isUpper,
  toggleShift,
  onAlphaCycle,
  onInsertChar,
  onInsertCharCycle,
  onBackspace,
  goHangulMode,
  goNumberMode,
  goSymbolMode,
}) {
  const labelABC = isUpper ? "ABC" : "abc";
  const labelDEF = isUpper ? "DEF" : "def";
  const labelGHI = isUpper ? "GHI" : "ghi";
  const labelJKL = isUpper ? "JKL" : "jkl";
  const labelMNO = isUpper ? "MNO" : "mno";
  const labelPQRS = isUpper ? "PQRS" : "pqrs";
  const labelTUV = isUpper ? "TUV" : "tuv";
  const labelWXYZ = isUpper ? "WXYZ" : "wxyz";

  return (
    <div className="cheon-grid">
      {/* 1행: 모드 공통 */}
      <button className="cheon-key cheon-key--mode" onClick={goHangulMode}>
        한글
      </button>
      <button className="cheon-key cheon-key--mode cheon-key--mode-active">
        영타
      </button>
      <button className="cheon-key cheon-key--mode" onClick={goNumberMode}>
        123
      </button>
      <button className="cheon-key cheon-key--mode" onClick={goSymbolMode}>
        기호
      </button>

      {/* 2행: ,?! | ABC | DEF | ⌫ */}
      <button
        className="cheon-key"
        onClick={() => onInsertCharCycle([",", "?", "!"])}
      >
        ,?!
      </button>
      <button
        className="cheon-key"
        onClick={() => onAlphaCycle(["a", "b", "c"])}
      >
        {labelABC}
      </button>
      <button
        className="cheon-key"
        onClick={() => onAlphaCycle(["d", "e", "f"])}
      >
        {labelDEF}
      </button>
      <button className="cheon-key cheon-key--func" onClick={onBackspace}>
        ⌫
      </button>

      {/* 3행: GHI | JKL | MNO | ↵ */}
      <button
        className="cheon-key"
        onClick={() => onAlphaCycle(["g", "h", "i"])}
      >
        {labelGHI}
      </button>
      <button
        className="cheon-key"
        onClick={() => onAlphaCycle(["j", "k", "l"])}
      >
        {labelJKL}
      </button>
      <button
        className="cheon-key"
        onClick={() => onAlphaCycle(["m", "n", "o"])}
      >
        {labelMNO}
      </button>
      <button
        className="cheon-key cheon-key--enter"
        onClick={() => onInsertChar("\n")}
      >
        ↵
      </button>

      {/* 4행: PQRS | TUV | WXYZ | Shift */}
      <button
        className="cheon-key"
        onClick={() => onAlphaCycle(["p", "q", "r", "s"])}
      >
        {labelPQRS}
      </button>
      <button
        className="cheon-key"
        onClick={() => onAlphaCycle(["t", "u", "v"])}
      >
        {labelTUV}
      </button>
      <button
        className="cheon-key"
        onClick={() => onAlphaCycle(["w", "x", "y", "z"])}
      >
        {labelWXYZ}
      </button>
      <button
        className={
          "cheon-key cheon-key--func" + (isUpper ? " cheon-key--shift-on" : "")
        }
        onClick={toggleShift}
      >
        ↑
      </button>

      {/* 5행: SPACE(2칸) + 빈 + ↵ */}
      <button
        className="cheon-key cheon-key--space"
        onClick={() => onInsertChar(" ")}
      >
        SPACE
      </button>
      <div className="cheon-key cheon-key--empty" />
    </div>
  );
}
