/*
 * 리뷰 목록 헤더와 카드가 공유하는 grid column 정의입니다.
 * 헤더와 row가 같은 레이아웃을 사용해야 하므로 별도 상수로 분리합니다.
 */
export const REVIEW_GRID =
  'grid items-center gap-3 text-sm ' +
  '[grid-template-columns:64px_minmax(0,1.5fr)_minmax(0,1.05fr)_minmax(0,.9fr)_minmax(0,.9fr)_minmax(0,.8fr)_minmax(0,.75fr)_132px] ' +
  'xl:gap-5 xl:[grid-template-columns:80px_minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,.9fr)_160px]'
