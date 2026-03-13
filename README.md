# Voxel Weather Dashboard (Tempo-Weather OS)

A Minecraft/voxel-inspired weather dashboard built with React, TypeScript, and Tailwind CSS.

## 🗺️ Where are the endpoints?

Currently, this application is a **frontend-only prototype**. There are no external API endpoints (such as OpenWeatherMap, WeatherAPI, or a custom backend) connected. 

Instead, all weather data, locations, and metrics are **simulated locally** using a predefined `BIOMES` constant inside the application. This allows the dashboard to function fully as a UI prototype without needing API keys, network requests, or a backend server.

## 🧠 Where is the logic?

All of the core application logic, state management, and data simulation resides in a single file:
👉 **`src/App.tsx`**

The custom styling, voxel/pixel-art CSS classes (like the brutalist borders, shadows, and animations), and font imports are located in:
👉 **`src/index.css`**

## 🔄 How the Data Dashboard Updates (The Logic)

The dashboard updates dynamically through a combination of React State and simulated real-time intervals. Here is exactly how the logic flows:

### 1. State Management
The app uses React's `useState` hooks to keep track of the current environment:
*   `biome`: The current location being viewed (e.g., 'plains', 'desert', 'tundra').
*   `weather`: The current weather condition (e.g., 'sunny', 'rainy', 'snowy').
*   `currentData`: An object holding the specific metrics currently displayed on the screen (temperature, humidity, wind speed, etc.).
*   `activeSlot`: Tracks which inventory slot is currently selected.

### 2. Simulated "Live" Sensor Data (The Update Loop)
To make the dashboard feel alive and responsive, there is a `useEffect` hook in `src/App.tsx` that acts as a live data feed:
*   It sets up a `setInterval` loop that fires every **3 seconds**.
*   Every tick, it takes the base stats of the currently selected biome and applies a small random mathematical variation (e.g., +/- 2% to humidity, +/- 1 degree to temperature).
*   It then updates the `currentData` state with these new randomized values.
*   Because React is state-driven, updating `currentData` causes the UI components (like the XP bars, temperature text, and stat cards) to instantly re-render and animate to the new values.

### 3. Weather Inventory Controls
The "Weather Inventory" at the bottom right acts as a control panel for the environment:
*   When a user clicks an inventory slot, the `handleSlotClick` function is triggered.
*   This function updates the `activeSlot`, changes the `weather` state, and switches the `biome` to match the selected weather (e.g., clicking the Snow icon changes the biome to 'tundra').
*   Changing the biome automatically loads a new set of base stats into the dashboard, instantly transforming the UI colors and metrics.

### 4. Search Bar Logic
*   The search bar uses a `searchQuery` state to filter through the keys of the `BIOMES` object in real-time.
*   When a user clicks a search result, the `handleLocationSelect` function is called.
*   This updates the `biome` state to the selected location, clears the search, and updates the dashboard with the new location's data.
*   A `mousedown` event listener is attached to the document via a `useEffect` hook. It checks if a click occurred outside the `searchRef` element. If so, it automatically clears the search query, closing the dropdown to keep the UI clean.
# TEMPO-WEATHER
