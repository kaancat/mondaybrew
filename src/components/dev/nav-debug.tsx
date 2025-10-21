"use client";

import { useEffect, useState } from "react";

export function NavDebug() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // This will help us see what data is actually being passed to the navbar
    const checkData = () => {
      const navElement = document.querySelector('[data-nav-debug]');
      if (navElement) {
        const debugData = navElement.getAttribute('data-nav-debug');
        if (debugData) {
          setData(JSON.parse(debugData));
        }
      }
    };

    checkData();
    const interval = setInterval(checkData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_DEBUG_NAV) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-black/90 text-white p-4 rounded max-w-md text-xs">
      <h3 className="font-bold mb-2">Nav Debug</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-96">
        {data ? JSON.stringify(data, null, 2) : 'No data found'}
      </pre>
    </div>
  );
}
