"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);

  // 1. Use Motion Values instead of React State for position (This fixes the lag)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 2. Add a spring for smooth, fast, buttery movement
  const springConfig = { stiffness: 1200, damping: 60, mass: 0.1 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference rounded-full"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      animate={{
        width: isHovering ? 40 : 12,
        height: isHovering ? 40 : 12,
        // We use negative margins to keep it perfectly centered on the mouse tip
        marginLeft: isHovering ? -20 : -6,
        marginTop: isHovering ? -20 : -6,
        backgroundColor: isHovering ? "#1A1A1A" : "#F4EFE6",
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    />
  );
}