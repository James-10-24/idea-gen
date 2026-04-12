"use client";

import { useEffect, useState } from "react";

export default function FirstStepToast({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in">
      <div className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 shadow-lg">
        <span className="text-[13px]">🚀</span>
        <span className="text-[13px] font-medium text-white">
          Nice — you&apos;ve started building.
        </span>
      </div>
    </div>
  );
}
