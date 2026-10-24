import { useState } from "react";
import Navbar from "./components/Navbar";
import WeatherScene from "./components/WeatherScene";
import WeatherDisplay from "./components/WeatherDisplay";
import LocationSelector from "./components/LocationSelector";
import ChatSection from "./components/ChatSection";
import ChatInput from "./components/ChatInput";
import { askWeather, API_URL } from "./services/weatherService";
import { readSky } from "./utils/weatherUtils";

export default function App() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [place, setPlace] = useState("");
  const [geoMsg, setGeoMsg] = useState("");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sky, setSky] = useState({ mood: "idle" });
  const [shownPlace, setShownPlace] = useState("");
  const ok = lat !== "" && lon !== "" && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lon));
  const lastBot = [...msgs].reverse().find((message) => message.role === "bot");

  const choose = (selectedPlace) => {
    setLat(String(selectedPlace.lat));
    setLon(String(selectedPlace.lon));
    setPlace(selectedPlace.name);
    setGeoMsg("");
  };

  const locate = () => {
    if (!navigator.geolocation) { setGeoMsg("This browser can't share location."); return; }
    setGeoMsg("Finding you...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(4));
        setLon(position.coords.longitude.toFixed(4));
        setPlace("Here");
        setGeoMsg("");
      },
      () => setGeoMsg("Location is blocked. Allow it, or pick a city."),
      { timeout: 10000 }
    );
  };

  const ask = async (question) => {
    if (!ok || loading) return;
    const prompt = (question ?? input).trim() || "What is the weather?";
    setMsgs((current) => [...current, { role: "me", text: prompt }]);
    setInput("");
    setLoading(true);
    try {
      const data = await askWeather(prompt, lat, lon);
      if (data.status) {
        setMsgs((current) => [...current, { role: "bot", text: data.reply }]);
        const parsed = readSky(data.reply);
        setSky({
          ...parsed,
          temp: data.temperature ?? parsed.temp,
          wind: data.windspeed ?? parsed.wind,
        });
        setShownPlace(data.location_detected || place || "Selected location");
      } else {
        setMsgs((current) => [...current, { role: "err", text: data.message || "The weather service could not answer." }]);
      }
    } catch (error) {
      setMsgs((current) => [...current, { role: "err", text: `Can't reach ${API_URL}. Is the backend running? (${error.message})` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sk">
      <WeatherScene mood={sky.mood} wind={sky.wind} />
      <div className="sk-layout">
        <Navbar />
        <main className="sk-main">
          <WeatherDisplay sky={sky} shownPlace={shownPlace} />
          <LocationSelector lat={lat} lon={lon} place={place} geoMsg={geoMsg} ok={ok} onLocate={locate} onChoose={choose} onLatChange={(value) => { setLat(value); setPlace(""); }} onLonChange={(value) => { setLon(value); setPlace(""); }} />
          <ChatSection msgs={msgs} loading={loading} lastBot={lastBot} ok={ok} onAsk={ask} />
          <ChatInput input={input} setInput={setInput} ok={ok} loading={loading} onAsk={ask} />
        </main>
      </div>
    </div>
  );
}
