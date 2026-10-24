import { useEffect, useState } from "react";

// Reveals the newest chatbot reply character by character.
export default function Typed({ text, animate }) {
  const [n, setN] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 2)), 16);
    return () => clearInterval(id);
  }, [text, animate]);
  return <>{text.slice(0, n)}</>;
}
