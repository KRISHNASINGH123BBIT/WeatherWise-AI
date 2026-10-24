from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import ollama

app = FastAPI()

# Allow the Vite dev server (React frontend) to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/ask_weather")
def ask_weather(data: dict):
    prompt = data.get("prompt", "What is the weather?")
    lat = data.get("lat")
    lon = data.get("lon")

    if lat is None or lon is None:
        return {
            "status": False,
            "message": "Please provide latitude and longitude."
        }

    try:
        # 1. Get the location name using OpenStreetMap
        osm_url = (
            "https://nominatim.openstreetmap.org/reverse"
            f"?format=json&lat={lat}&lon={lon}"
        )

        osm_response = requests.get(
            osm_url,
            headers={"User-Agent": "MyWeatherChatApp/1.0"},
            timeout=10
        )
        osm_response.raise_for_status()

        address = osm_response.json().get("address", {})

        location_name = (
            address.get("suburb")
            or address.get("city")
            or address.get("town")
            or "your area"
        )

        # 2. Get current weather using Open-Meteo
        weather_url = "https://api.open-meteo.com/v1/forecast"

        weather_params = {
            "latitude": lat,
            "longitude": lon,
            "current_weather": True
        }

        weather_response = requests.get(
            weather_url,
            params=weather_params,
            timeout=10
        )
        weather_response.raise_for_status()

        current_weather = weather_response.json().get(
            "current_weather", {}
        )

        temp = current_weather.get("temperature")
        wind = current_weather.get("windspeed")

        if temp is None or wind is None:
            return {
                "status": False,
                "message": "Could not retrieve current weather data."
            }

        # 3. Generate a conversational reply using local Qwen
        ai_context = (
            f"The user asked: {prompt}\n"
            f"Location: {location_name}\n"
            f"Current temperature: {temp} degrees Celsius\n"
            f"Wind speed: {wind} km/h\n\n"
            "You are a helpful weather assistant. "
            "Answer the user's question conversationally. "
            "Use the weather data provided above. "
            "Keep the answer clear, natural, and concise. "
            "Do not invent weather information."
        )

        qwen_response = ollama.chat(
            model="qwen2.5:0.5b",
            messages=[
                {
                    "role": "user",
                    "content": ai_context
                }
            ]
        )

        reply = qwen_response["message"]["content"]

        # 4. Return the final response
        return {
            "status": True,
            "location_detected": location_name,
            "temperature": temp,
            "windspeed": wind,
            "reply": reply
        }

    except requests.RequestException as e:
        return {
            "status": False,
            "message": f"Weather or location service error: {str(e)}"
        }

    except Exception as e:
        return {
            "status": False,
            "message": f"An error occurred: {str(e)}"
        }