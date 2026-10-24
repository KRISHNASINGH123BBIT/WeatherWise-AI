import { MOOD_LABEL } from "../utils/weatherUtils";

export default function WeatherDisplay({ sky, shownPlace }) {
  const { mood, temp, wind } = sky;
  return (
    <section className="sk-hero" aria-live="polite">
      {temp != null ? (
        <>
          <p className="sk-where">{shownPlace}{MOOD_LABEL[mood] ? ` · ${MOOD_LABEL[mood]}` : ""}</p>
          <h1 className="sk-temp">{Math.round(temp)}<small>°C</small></h1>
          {wind != null && <p className="sk-wind">Wind {wind} km/h</p>}
        </>
      ) : (
        <>
          <h1 className="sk-hello">What's the sky doing today?</h1>
          <p className="sk-wind">Pick a place, then ask anything.</p>
        </>
      )}
    </section>
  );
}
