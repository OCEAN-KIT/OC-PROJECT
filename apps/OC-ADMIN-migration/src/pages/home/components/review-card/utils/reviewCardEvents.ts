/*
 * ReviewCard의 클릭 가능한 카드 영역과 내부 조작 요소를 구분하는 이벤트 helper입니다.
 * 카드 전체 클릭은 상세 이동을 해야 하지만, 체크박스/버튼/링크 조작은
 * 부모 카드 클릭으로 새면 안 되므로 판별 로직을 별도로 둡니다.
 */
const INTERACTIVE_CARD_TARGET_SELECTOR = "input, button, a";

export function isInteractiveCardTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    target.closest(INTERACTIVE_CARD_TARGET_SELECTOR) !== null
  );
}
