import { useEffect, useMemo, useState } from "react";
import { hills, rnd, SKY } from "../utils/weatherUtils";

export default function WeatherScene({ mood, wind }) {
  const [risen, setRisen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setRisen(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const rainy = mood === "rain";
  const snowy = mood === "snow";
  const hot = mood === "hot";
  const fast = wind > 20;
  const covered = rainy || snowy;
  const sunSize = hot ? 150 : 100;
  const sunColor = hot ? "#fffbc8" : "#fff3c4";
  const sunGlow = hot
    ? "0 0 110px 70px rgba(255,225,120,.8),0 0 260px 130px rgba(255,170,60,.45)"
    : "0 0 60px 30px rgba(255,236,170,.55)";
  const tint = rainy ? "rgba(38,48,60,.62)" : snowy ? "rgba(110,130,155,.5)" : hot ? "rgba(255,140,30,.2)" : mood === "cool" ? "rgba(70,120,185,.2)" : "rgba(0,0,0,0)";
  const cloudColor = "rgba(255,255,255,.68)";
  const bankColor = rainy ? "#4c5a69" : "#8d9bab";
  const [hillA, hillB] = hills(mood);
  const drops = useMemo(() => Array.from({ length: 90 }, (_, i) => ({ left: `${rnd(i, 1) * 100}%`, dur: `${0.65 + rnd(i, 2) * 0.5}s`, delay: `${rnd(i, 3) * 2}s` })), []);
  const flakes = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ left: `${rnd(i, 4) * 100}%`, size: 3 + rnd(i, 5) * 6, dur: `${6 + rnd(i, 6) * 7}s`, delay: `-${rnd(i, 7) * 12}s`, sway: `${2 + rnd(i, 8) * 2}s`, op: 0.55 + rnd(i, 9) * 0.45 })), []);
  const clouds = useMemo(() => [
    { top: "14%", w: 110, dur: 70 }, { top: "26%", w: 150, dur: 95 },
    { top: "6%", w: 90, dur: 120 }, { top: "34%", w: 130, dur: 80 },
  ], []);

  return (
    <div className="sk-scene" style={{ "--cl": cloudColor, "--bank": bankColor }}>
      <div className="sk-abs" style={{ background: SKY }} />
      <div className="sk-abs sk-tint" style={{ background: tint }} />
      <div className="sk-body sk-sun" style={{ left: "78%", top: risen ? "18%" : "98%", width: sunSize, height: sunSize, background: sunColor, boxShadow: sunGlow, opacity: rainy ? 0.1 : snowy ? 0.35 : 1 }}>
        <div className={`sk-rays ${hot ? "on" : ""}`} />
      </div>
      <div className="sk-abs">
        {clouds.map((c, i) => <div key={i} className="sk-cloud sk-drift" style={{ top: c.top, fontSize: c.w, width: "1em", animationDuration: `${fast ? c.dur / 3 : c.dur}s`, animationDelay: `-${i * 20}s`, opacity: covered ? 0 : hot ? 0.25 : 1 }} />)}
      </div>
      <div className="sk-abs">
        <div className="sk-bank" style={{ opacity: covered ? 1 : 0 }}>
          {Array.from({ length: 7 }, (_, i) => <div key={i} className="sk-cloud" style={{ left: `${i * 16 - 9}%`, top: i % 2 ? "-3%" : "2%", fontSize: 230, width: "1em", animationDelay: `-${i * 0.9}s` }} />)}
        </div>
      </div>
      <div className="sk-abs sk-heat sk-fade" style={{ opacity: hot ? 1 : 0, top: "55%" }} />
      {rainy && <div className="sk-abs">{drops.map((d, i) => <span key={i} className="sk-drop" style={{ left: d.left, animationDuration: d.dur, animationDelay: d.delay }} />)}</div>}
      {snowy && <div className="sk-abs">{flakes.map((f, i) => <span key={i} className="sk-flake" style={{ left: f.left, animationDuration: f.dur, animationDelay: f.delay, opacity: f.op }}><i style={{ width: f.size, height: f.size, animationDuration: f.sway }} /></span>)}</div>}
      <svg className="sk-hills" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 10 Q18 0 38 9 T72 8 T100 4 V30 H0Z" fill={hillB} />
        <path d="M0 16 Q16 8 34 15 T68 14 T100 11 V30 H0Z" fill={hillA} />
      </svg>
    </div>
  );
}
