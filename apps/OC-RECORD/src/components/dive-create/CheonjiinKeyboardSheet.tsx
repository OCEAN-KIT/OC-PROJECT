"use client";

import { useCallback, useRef, type MouseEvent } from "react";
import CheonjiinKeyboard from "react-cji-keyboard";

type CheonjiinKeyboardSheetProps = {
  baseValue: string;
  onChange: (value: string) => void;
  onClose: () => void;
};

const removeLastCharacter = (value: string) =>
  Array.from(value).slice(0, -1).join("");

export default function CheonjiinKeyboardSheet({
  baseValue,
  onChange,
  onClose,
}: CheonjiinKeyboardSheetProps) {
  const baseValueRef = useRef(baseValue);
  const keyboardValueRef = useRef("");
  const onChangeRef = useRef(onChange);
  const hasHandledInitialChangeRef = useRef(false);
  onChangeRef.current = onChange;

  const handleKeyboardChange = useCallback((keyboardValue: string) => {
    keyboardValueRef.current = keyboardValue;

    if (!hasHandledInitialChangeRef.current) {
      hasHandledInitialChangeRef.current = true;

      if (keyboardValue.length === 0) {
        return;
      }
    }

    onChangeRef.current(`${baseValueRef.current}${keyboardValue}`);
  }, []);

  const handleKeyboardClickCapture = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("button");
      if (!button || button.textContent?.trim() !== "⌫") return;
      if (keyboardValueRef.current.length > 0) return;
      if (baseValueRef.current.length === 0) return;

      baseValueRef.current = removeLastCharacter(baseValueRef.current);
      onChangeRef.current(baseValueRef.current);
    },
    [],
  );

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onMouseDown={onClose}
        onTouchStart={onClose}
      />

      <div className="fixed left-0 right-0 bottom-0 z-50">
        <div
          className="mx-auto max-w-105 bg-white"
          onClickCapture={handleKeyboardClickCapture}
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        >
          <CheonjiinKeyboard onChange={handleKeyboardChange} />
        </div>
      </div>
    </>
  );
}
