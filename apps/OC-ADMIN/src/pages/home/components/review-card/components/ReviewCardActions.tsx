/*
 * 리뷰 카드 우측 액션 버튼 묶음입니다.
 * 승인/반려/삭제 버튼의 표시와 이벤트 전파 차단만 담당하고,
 * 실제 mutation 동작은 상위에서 받은 콜백으로 위임합니다.
 */
import type { MouseEvent } from "react";
import { Trash2 } from "lucide-react";

type ReviewCardActionsProps = {
  isPending: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
};

function stopActionEvent(event: MouseEvent<HTMLButtonElement>) {
  event.stopPropagation();
  event.preventDefault();
}

function runAction(
  event: MouseEvent<HTMLButtonElement>,
  action: (() => void) | undefined,
) {
  stopActionEvent(event);
  action?.();
}

export function ReviewCardActions({
  isPending,
  onApprove,
  onReject,
  onDelete,
}: ReviewCardActionsProps) {
  return (
    <div className="flex min-w-0 items-center justify-end gap-2 whitespace-nowrap">
      {isPending && (
        <>
          <button
            type="button"
            onMouseDown={stopActionEvent}
            onClick={(event) => runAction(event, onReject)}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
          >
            반려
          </button>
          <button
            type="button"
            onMouseDown={stopActionEvent}
            onClick={(event) => runAction(event, onApprove)}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
          >
            승인
          </button>
        </>
      )}

      <button
        type="button"
        onMouseDown={stopActionEvent}
        onClick={(event) => runAction(event, onDelete)}
        className="inline-flex h-9 w-9 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 shadow-sm transition-all duration-200 ease-out hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-rose-300 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
        aria-label="제출 삭제"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
