// app/dashBoard/layout.tsx
export default function DashBoardLayout({
  children,
  modal, // @modal 병렬 슬롯
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal} {/* 인터셉트된 모달이 여기로 주입됨 */}
    </>
  );
}
