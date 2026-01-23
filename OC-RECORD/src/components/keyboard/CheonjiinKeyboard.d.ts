interface CheonjiinKeyboardProps {
  onChange: (text: string) => void;
  initialValue?: string;
}

declare const CheonjiinKeyboard: React.FC<CheonjiinKeyboardProps>;

export default CheonjiinKeyboard;
