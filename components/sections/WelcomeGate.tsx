"use client";

import { useEffect, useState } from "react";
import Welcome from "./Welcome";

export default function WelcomeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 700px)");
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    // CSS: below 700px the whole block is display:none (no layout space)
    <div className="hidden min-[700px]:block">
      {show ? (
        <Welcome />
      ) : (
        // Placeholder with the same height, so desktop has no layout jump before hydration
        <div className="h-screen w-full bg-cream border-b-4 border-ink" />
      )}
    </div>
  );
}