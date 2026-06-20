"use client";

import { useCallback, useRef } from "react";
import CheonjiinKeyboard from "react-cji-keyboard";

type CheonjiinKeyboardSheetProps = {
  baseValue: string;
  onChange: (value: string) => void;
  onClose: () => void;
};

export default function CheonjiinKeyboardSheet({
  baseValue,
  onChange,
  onClose,
}: CheonjiinKeyboardSheetProps) {
  const baseValueRef = useRef(baseValue);
  const hasHandledInitialChangeRef = useRef(false);

  const handleKeyboardChange = useCallback(
    (keyboardValue: string) => {
      if (!hasHandledInitialChangeRef.current) {
        hasHandledInitialChangeRef.current = true;

        if (keyboardValue.length === 0) {
          return;
        }
      }

      onChange(`${baseValueRef.current}${keyboardValue}`);
    },
    [onChange],
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
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        >
          <CheonjiinKeyboard onChange={handleKeyboardChange} />
        </div>
      </div>
    </>
  );
}
