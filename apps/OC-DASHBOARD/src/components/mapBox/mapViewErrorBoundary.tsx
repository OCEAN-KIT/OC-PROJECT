"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export default class MapViewErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[MapView] runtime error:", error, errorInfo);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-[var(--ds-bg)] px-4 text-slate-50"
        style={{ height: "var(--app-height, 100dvh)" }}
      >
        <div className="oc-panel max-w-md rounded-2xl px-5 py-4 text-center">
          <h2 className="text-base font-semibold">지도를 표시하지 못했습니다</h2>
          <p className="mt-2 text-sm leading-relaxed text-indigo-100/72">
            Mapbox 설정 또는 네트워크 상태를 확인해 주세요.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-50 transition hover:border-indigo-300/60 hover:bg-indigo-500/20"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }
}
