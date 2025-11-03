// src/app/detailinfo/layout.jsx
import "@/components/detail-info/page-bg.css";

export default function DetailInfoRouteLayout({ children }) {
  return (
    <div className="ai-bg-container">
      {/* ✅ 페이지 전체에만 적용되는 배경 레이어 */}
      <div className="ai-bg-layer" aria-hidden />

      {/* 실제 컨텐츠는 배경 위로 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
