import { useEffect, useState } from "react";

// 온라인, 오프라인 상태 구별을 위한 훅입니다.
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("focus", updateOnlineStatus);
    document.addEventListener("visibilitychange", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("focus", updateOnlineStatus);
      document.removeEventListener("visibilitychange", updateOnlineStatus);
    };
  }, []);

  return isOnline;
}
