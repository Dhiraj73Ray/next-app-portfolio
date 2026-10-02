"use client";

import { useEffect, useState } from "react";

// Mount ke baad hi time dikhata hai (server/client mismatch se bachne ke liye)
export default function LiveClock({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const opts: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    };
    let fmt: Intl.DateTimeFormat;
    try {
      fmt = new Intl.DateTimeFormat("en-IN", { ...opts, timeZone });
    } catch {
      fmt = new Intl.DateTimeFormat("en-IN", opts); // galat timezone string ho toh local
    }
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return <span suppressHydrationWarning>{time || "—"}</span>;
}