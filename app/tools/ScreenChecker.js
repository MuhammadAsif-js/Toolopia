"use client";

import { useState, useEffect } from "react";

export default function ScreenChecker() {
  const [isClient, setIsClient] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);

    if (typeof window === "undefined") return;

    const updateSize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  if (!isClient) {
    return (
      <div className="screen-checker text-center py-10">
        <p className="text-muted-foreground">Loading screen size…</p>
      </div>
    );
  }

  return (
    <div className="screen-checker max-w-md mx-auto p-6 rounded-2xl shadow bg-white dark:bg-gray-900">
      <h3 className="font-bold text-xl mb-4 text-center">📱 Screen Checker</h3>
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground">Width: <span className="font-mono">{width ?? "—"}</span></p>
        <p className="text-muted-foreground">Height: <span className="font-mono">{height ?? "—"}</span></p>
      </div>
    </div>
  );
}
