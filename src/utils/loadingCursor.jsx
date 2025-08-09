// loadingCursor.js
import { useEffect } from "react";

export default function LoadingCursor({ active }) {
  useEffect(() => {
    if (active) {
      document.body.classList.add("hide-cursor");
    } else {
      document.body.classList.remove("hide-cursor");
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
