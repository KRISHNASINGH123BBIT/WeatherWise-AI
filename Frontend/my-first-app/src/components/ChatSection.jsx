import { useEffect, useRef } from "react";
import Typed from "./Typed";
import { ASKS } from "../utils/weatherUtils";

export default function ChatSection({ msgs, loading, lastBot, ok, onAsk }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);
  return (
    <>
      <section className="sk-glass sk-chat" aria-label="Chat messages">
        {msgs.length === 0 && !loading && <div className="sk-empty">Your answers appear here. Try "Do I need a jacket?"</div>}
        {msgs.map((m, i) => <div key={i} className={`sk-msg ${m.role === "me" ? "sk-me" : m.role === "bot" ? "sk-bot" : "sk-err"}`}>{m.role === "bot" ? <Typed text={m.text} animate={m === lastBot} /> : m.text}</div>)}
        {loading && <div className="sk-msg sk-bot sk-dots" aria-label="Loading"><span /><span /><span /></div>}
        <div ref={endRef} />
      </section>
      <div className="sk-pills">
        {ASKS.map((question) => <button key={question} disabled={!ok || loading} onClick={() => onAsk(question)}>{question}</button>)}
      </div>
    </>
  );
}
