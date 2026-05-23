/*
 * 리뷰 카드의 선택 체크박스와 id 표시를 담당합니다.
 * pending 상태가 아닌 항목은 선택할 수 없으므로 체크박스 자리만 유지해
 * 목록 grid 정렬이 흔들리지 않게 합니다.
 */
import type { SyntheticEvent } from "react";

type ReviewCardSelectionCellProps = {
  id: string;
  isSelectable: boolean;
  selected: boolean;
  onToggle?: () => void;
};

function stopOnlyBubble(event: SyntheticEvent) {
  event.stopPropagation();
}

export function ReviewCardSelectionCell({
  id,
  isSelectable,
  selected,
  onToggle,
}: ReviewCardSelectionCellProps) {
  return (
    <div className="flex items-center gap-2 pl-1">
      {isSelectable ? (
        <input
          type="checkbox"
          checked={selected}
          onClick={stopOnlyBubble}
          onMouseDown={stopOnlyBubble}
          onChange={onToggle}
          aria-label={`${id} 선택`}
          className="h-4 w-4 accent-blue-600"
        />
      ) : (
        <span className="w-4" />
      )}
      <span className="font-semibold text-gray-900">#{id}</span>
    </div>
  );
}
