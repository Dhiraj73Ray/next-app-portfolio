"use client";

import { useEffect, useState, useRef } from "react";
// import Welcome from "./Welcome";
import dynamic from "next/dynamic";


const Welcome = dynamic(() => import("./Welcome"), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-cream border-b-4 border-ink" />,
});

export default function WelcomeGate() {
  const [show, setShow] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 700px)");
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!show || !ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [show]);

  return (
    // CSS: below 700px the whole block is display:none (no layout space)
    <div className="hidden min-[700px]:block">
      {show && inView ? (
        <Welcome />
      ) : (
        // Placeholder with the same height, so desktop has no layout jump before hydration
        <div className="h-screen w-full bg-cream border-b-4 border-ink" />
      )}
    </div>
  );
}