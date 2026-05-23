"use client";

import { useEffect } from "react";

function scrollToId(id: string, maxWaitMs = 3000) {
  const start = Date.now();
  const tick = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (Date.now() - start < maxWaitMs) {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

export default function ScrollRestorer() {
  useEffect(() => {
    const target = sessionStorage.getItem("scrollTo");
    if (target) {
      sessionStorage.removeItem("scrollTo");
      scrollToId(target);
    }
  }, []);

  return null;
}
