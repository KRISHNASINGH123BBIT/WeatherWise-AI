import { PLACES } from "../utils/weatherUtils";

export default function LocationSelector({ lat, lon, place, geoMsg, ok, onLocate, onChoose, onLatChange, onLonChange }) {
  return (
    <>
      <div className="sk-pills" aria-label="Choose a location">
        <button className={place === "Here" ? "on" : ""} onClick={onLocate}>Use my location</button>
        {PLACES.map((p) => <button key={p.name} className={place === p.name ? "on" : ""} onClick={() => onChoose(p)}>{p.name}</button>)}
      </div>
      <div className="sk-coords">
        <input placeholder="Latitude" value={lat} inputMode="decimal" aria-label="Latitude" onChange={(e) => onLatChange(e.target.value)} />
        <input placeholder="Longitude" value={lon} inputMode="decimal" aria-label="Longitude" onChange={(e) => onLonChange(e.target.value)} />
      </div>
      {(geoMsg || !ok) && <p className="sk-note" role="status">{geoMsg || "Choose a location to start."}</p>}
    </>
  );
}
