# Weather Chatbot Frontend (React + Vite)

## Folder map
- `src/components/`: Navbar, weather scene/display, location picker, chat and typing animation.
- `src/css/global.css`: weather scene and interface styles.
- `src/services/weatherService.js`: API call to FastAPI.
- `src/utils/weatherUtils.js`: weather parsing and shared constants.
- `src/App.jsx`: state and component coordination.

## Run
1. Open this folder in VS Code.
2. Run `npm install` if dependencies are not installed.
3. Run `npm run dev`.
4. Start your FastAPI backend on `http://localhost:8000`.

The frontend sends POST requests to `http://localhost:8000/ask_weather`.
