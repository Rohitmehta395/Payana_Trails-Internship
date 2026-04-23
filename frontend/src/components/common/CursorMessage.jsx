import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const CursorMessage = ({ message, isVisible }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0,
    );

    let timer;
    if (isVisible) {
      setShouldShow(true);
      timer = setTimeout(() => {
        setShouldShow(false);
      }, 1500);
    } else {
      setShouldShow(false);
    }

    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    if (isVisible) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timer) clearTimeout(timer);
    };
  }, [isVisible]);

  if (!isVisible || !shouldShow || isTouchDevice) return null;

  return createPortal(
    <div
      className="fixed pointer-events-none z-[9999] bg-[#F3EFE9] text-[#4A3B2A] px-2.5 py-1 rounded-full text-[10px] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-[#4A3B2A]/20 transition-opacity duration-300 ease-in-out whitespace-nowrap uppercase tracking-widest"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(10px, 10px)", // Smaller offset
      }}
    >
      {message}
    </div>,
    document.body,
  );
};

export default CursorMessage;
