/*
 * 홈 화면의 외곽 레이아웃만 담당합니다.
 * padding과 최대 너비 같은 페이지 shell을 고정하고,
 * 내부 섹션의 상태나 데이터 흐름에는 관여하지 않습니다.
 */
type HomePageLayoutProps = {
  children: React.ReactNode
}

export function HomePageLayout({ children }: HomePageLayoutProps) {
  return (
    <div className="p-4">
      <div className="mx-auto max-w-[1500px]">{children}</div>
    </div>
  )
}
