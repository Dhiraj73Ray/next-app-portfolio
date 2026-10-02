"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "../../data/siteConfig";

const RADIAL_ITEMS = [
  { id: "chat", label: "CHAT" },
  { id: "skills", label: "SKILLS" },
  { id: "projects", label: "PROJECTS" },
  { id: "resume", label: "RESUME" },
  { id: "contact", label: "CONTACT" },
];

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
};

export default function AICopilot() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const sliceAngle = 360 / RADIAL_ITEMS.length;

  // Handle closing the panel
  const handleClose = () => {
    setSelectedOption(null);
    setIsHovered(false);
  };

  // Handle mouse leaving the area
  const handleMouseLeave = () => {
    // Only close the radial menu on mouse leave.
    // If a panel is open (selectedOption is set), do NOT close it.
    if (!selectedOption) {
      setIsHovered(false);
    }
  };

  // Touch par "mouse leave" hota hi nahi, isliye bahar tap karo toh radial band
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsHovered(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  // Slice click: chat panel kholta hai, baaki items us section par le jaate hain
  const choose = (id: string) => {
    if (id === "chat") {
      setSelectedOption("chat");
      return;
    }
    setHoveredItem(null);
    setIsHovered(false);
    if (id === "resume" && site.resume) {
      window.open(site.resume, "_blank", "noopener");
      return;
    }
    const target = id === "resume" ? "contact" : id; // resume file set nahi hai toh contact par
    document.getElementById(target)?.scrollIntoView(); // globals.css ka smooth + nav offset follow karta hai
  };

  return (
    <div
      ref={rootRef}
      className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 transition-all duration-300 ${
        isHovered || selectedOption ? "w-80 h-96 max-w-[calc(100vw-2rem)]" : "w-auto h-auto"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        {!selectedOption && !isHovered ? (
          // 1. THE IDLE BUTTON
          <motion.button
            key="button"
            layoutId="ai-copilot"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="absolute bottom-0 right-0 bg-cream text-ink font-mono text-sm uppercase px-5 py-3 border-2 border-ink hover:bg-ink hover:text-cream transition-colors duration-200"
          >
            [ AI ]
          </motion.button>
        ) : !selectedOption && isHovered ? (
          // 2. THE RADIAL MENU
          <motion.div
            key="radial"
            layoutId="ai-copilot"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="absolute bottom-0 right-0 w-64 h-64 origin-bottom-right"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
              {RADIAL_ITEMS.map((item, index) => {
                const startAngle = index * sliceAngle;
                const endAngle = startAngle + sliceAngle;
                const path = describeArc(100, 100, 100, startAngle, endAngle);
                const isItemHovered = hoveredItem === item.id;

                return (
                  <g key={item.id}>
                    <path
                      d={path}
                      fill={isItemHovered ? "#D9531E" : "#F4EFE6"}
                      stroke="#1A1A1A"
                      strokeWidth="1.5"
                      className="transition-colors duration-150 cursor-pointer"
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => choose(item.id)}
                    />
                    <text
                      x="100"
                      y="100"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${startAngle + sliceAngle / 2}, 100, 100) translate(0, -60)`}
                      className="font-mono text-[8px] fill-ink pointer-events-none"
                      style={{ fill: isItemHovered ? "#F4EFE6" : "#1A1A1A" }}
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="35" fill="#1A1A1A" stroke="#F4EFE6" strokeWidth="1.5" />
              <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="font-mono text-[10px] fill-cream pointer-events-none">
                {hoveredItem ? `[ ${hoveredItem.toUpperCase()} ]` : "[ AI ]"}
              </text>
            </svg>
          </motion.div>
        ) : (
          // 3. THE CHAT PANEL
          <motion.div
            key="panel"
            layoutId="ai-copilot"
            initial={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            // THIS IS THE FIX: Force it to shrink to the bottom-right corner
            exit={{ opacity: 0, scale: 0.5, y: 100, x: 100 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            style={{ transformOrigin: "bottom right" }} // Force origin
            className="absolute bottom-0 right-0 w-80 max-w-[calc(100vw-2rem)] h-96 bg-cream border-2 border-ink flex flex-col origin-bottom-right"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-ink p-3 bg-cream">
              <span className="font-mono text-xs uppercase text-ink">
                [ {selectedOption} ]
              </span>
              <button
                onClick={handleClose}
                className="font-mono text-xs text-ink hover:text-burnt transition-colors cursor-pointer"
              >
                [ X ]
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 p-4 overflow-y-auto font-sans text-sm bg-cream">
              <p className="text-ink/80">
                The AI assistant is coming soon. Until then, hover the [ AI ] button and pick a slice
                to jump straight to any section.
              </p>
            </div>
            {/* Input (backend ready hone tak disabled) */}
            <div className="border-t-2 border-ink p-3 bg-cream">
              <input
                type="text"
                disabled
                aria-label="AI chat (coming soon)"
                placeholder="Chat is coming soon..."
                className="w-full bg-transparent border-none outline-none font-sans text-sm text-ink placeholder:text-ink/40 cursor-not-allowed"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}