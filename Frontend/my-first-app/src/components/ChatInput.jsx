export default function ChatInput({ input, setInput, ok, loading, onAsk }) {
  return (
    <div className="sk-glass sk-bar">
      <input value={input} aria-label="Your question" placeholder="Ask about the weather..." onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAsk(); } }} />
      <button className="sk-send" disabled={!ok || loading} onClick={() => onAsk()}>{loading ? "Asking..." : "Ask"}</button>
    </div>
  );
}
