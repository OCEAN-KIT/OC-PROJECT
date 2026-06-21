/*
 * 리뷰 카드의 선택 체크박스와 id 표시를 담당합니다.
 * CSV 내보내기 대상 선택을 위해 제출 상태와 무관하게 체크박스를 표시합니다.
 */
import type { SyntheticEvent } from "react";

type ReviewCardSelectionCellProps = {
  id: string;
  selected: boolean;
  onToggle?: () => void;
};

function stopOnlyBubble(event: SyntheticEvent) {
  event.stopPropagation();
}

export function ReviewCardSelectionCell({
  id,
  selected,
  onToggle,
}: ReviewCardSelectionCellProps) {
  return (
    <div className="flex items-center gap-2 pl-1">
      <input
        type="checkbox"
        checked={selected}
        onClick={stopOnlyBubble}
        onMouseDown={stopOnlyBubble}
        onChange={onToggle}
        aria-label={`${id} 선택`}
        className="h-4 w-4 accent-blue-600"
      />
      <span className="font-semibold text-gray-900">#{id}</span>
    </div>
  );
}
