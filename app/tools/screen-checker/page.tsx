"use client"
import React, { useState, useEffect } from "react";

export default function ScreenChecker() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Update dimensions on resize
  useEffect(() => {
    // Ensure we're in the browser before setting up the event listener
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Initial call to set dimensions
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Screen Checker</h1>
  <div className="bg-card rounded-lg p-6 shadow border">
        <p className="text-lg">Width: <span className="font-mono">{dimensions.width}px</span></p>
        <p className="text-lg">Height: <span className="font-mono">{dimensions.height}px</span></p>
      </div>
    </div>
  );
}
