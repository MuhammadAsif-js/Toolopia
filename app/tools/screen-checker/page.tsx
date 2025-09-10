"use client"
import React, { useState } from "react";

export default function ScreenChecker() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update dimensions on resize
  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Screen Checker</h1>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-lg">Width: <span className="font-mono">{dimensions.width}px</span></p>
        <p className="text-lg">Height: <span className="font-mono">{dimensions.height}px</span></p>
      </div>
    </div>
  );
}
