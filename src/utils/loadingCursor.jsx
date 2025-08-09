// loadingCursor.js
import { useEffect } from "react";

export default function LoadingCursor({ active }) {
  useEffect(() => {
    if (active) {
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = "default";
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const cursor = document.querySelector(".custom-cursor");

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, [active]);

  if (!active) return null;
  return <div className="custom-cursor" />;
}
