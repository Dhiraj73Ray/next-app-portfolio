"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })} // smooth/instant globals.css decide karta hai
      className="inline-flex items-center gap-2 border border-cream/40 px-3 py-1.5 font-mono text-xs text-cream hover:bg-cream hover:text-ink transition-colors cursor-pointer"
    >
      Back to top <ArrowUp className="w-3.5 h-3.5" />
    </button>
  );
}