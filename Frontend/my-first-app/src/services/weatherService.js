const API_URL = "http://localhost:8000/ask_weather";

export async function askWeather(prompt, lat, lon) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, lat: Number(lat), lon: Number(lon) }),
  });
  if (!response.ok) throw new Error(`Server returned ${response.status}`);
  return response.json();
}

export { API_URL };
