export function readSky(text) {
  if (!text) return { mood: "idle" };
  const temperatureMatch = text.match(/(-?\d+(?:\.\d+)?)\s*(?:°|degrees)/i);
  const windMatch = text.match(/(\d+(?:\.\d+)?)\s*km\/h/i);
  const temp = temperatureMatch ? parseFloat(temperatureMatch[1]) : null;
  const wind = windMatch ? parseFloat(windMatch[1]) : null;
  const clean = text.replace(/\b(no|not|isn't|won't|without)\b[^.]*?\b(rain|snow|storm)\w*/gi, "");
  let mood = "mild";
  if (/snow|sleet|freez/i.test(clean) || (temp !== null && temp <= 5)) mood = "snow";
  else if (/rain|shower|drizzle|storm/i.test(clean)) mood = "rain";
  else if (temp !== null) mood = temp < 16 ? "cool" : temp > 30 ? "hot" : "mild";
  return { mood, temp, wind };
}

export const rnd = (i, s) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const hills = (mood) =>
  mood === "snow"
    ? ["#eef4f8", "#cfdce8"]
    : mood === "rain"
      ? ["#2d4a40", "#3d5c52"]
      : ["#2f6b4a", "#4b8a62"];

export const MOOD_LABEL = {
  cool: "Cool",
  mild: "Pleasant",
  hot: "Hot and bright",
  rain: "Rainy",
  snow: "Snowing",
};

export const PLACES = [
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
];

export const ASKS = [
  "What's the weather like?",
  "Do I need a jacket?",
  "Is it windy outside?",
  "Good time for a walk?",
];
export const SKY = "linear-gradient(180deg,#2f7fd0 0%,#7fc0ee 60%,#e8f3fb 100%)";
