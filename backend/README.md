# TEMPO-WEATHER Go Backend

This is the backend service for the TEMPO-WEATHER app, built using Go and the Gin web framework. It integrates with the Open-Meteo API to provide real-time weather, forecasts, air quality, and geocoding data.

## Prerequisites

- [Go](https://go.dev/doc/install) (version 1.25 or higher)

## Getting Started

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    go mod download
    ```

3.  **Run the server:**
    ```bash
    go run main.go
    ```
    The server will start on `http://localhost:8080`.

## API Endpoints

### 1. Weather Data
-   `GET /api/weather`: Fetches real-time weather conditions.
    -   **Parameters:**
        -   `biome`: (Optional) `plains`, `desert`, `taiga`, `jungle`.
        -   `lat`, `lon`: (Optional) Latitude and Longitude for specific locations.
    -   **Example:** `/api/weather?lat=51.50&lon=-0.12`

-   `GET /api/weather/hourly`: Fetches 24-hour weather forecast (temperature, precipitation, wind speed, etc.).
    -   **Parameters:** `lat`, `lon` (Required)
    -   **Example:** `/api/weather/hourly?lat=39.09&lon=-94.57`

-   `GET /api/weather/daily`: Fetches 7-day daily forecast (min/max temp, sunrise/sunset, UV index).
    -   **Parameters:** `lat`, `lon` (Required)
    -   **Example:** `/api/weather/daily?lat=30.04&lon=31.23`

-   `GET /api/weather/historical`: Fetches historical weather data for a date range.
    -   **Parameters:** `lat`, `lon`, `start_date` (YYYY-MM-DD), `end_date` (YYYY-MM-DD)
    -   **Example:** `/api/weather/historical?lat=51.5&lon=-0.12&start_date=2023-01-01&end_date=2023-01-07`

### 2. Location & Air Quality
-   `GET /api/geocoding/search`: Converts a city or location name into coordinates.
    -   **Parameters:** `name` (Required)
    -   **Example:** `/api/geocoding/search?name=London`

-   `GET /api/air-quality`: Fetches real-time air quality metrics (PM2.5, PM10, CO, NO2, AQI).
    -   **Parameters:** `lat`, `lon` (Required)
    -   **Example:** `/api/air-quality?lat=51.50&lon=-0.12`

### 3. Overrides
-   `POST /api/weather/override`: Manually overrides the current weather state for a location/biome.
    -   **Request Body:**
        ```json
        {
          "state": "sunny|rainy|stormy|snowy",
          "biome": "plains|desert|taiga|jungle",
          "lat": 0.0,
          "lon": 0.0
        }
        ```

## Architecture

-   `models/`: Data structures for API responses and Open-Meteo mappings.
-   `services/`: Core logic for fetching and processing data from external APIs.
-   `api/`: Gin handlers and route definitions.
-   `main.go`: Application entry point and middleware configuration (CORS).

## External Services
-   Uses [Open-Meteo API](https://open-meteo.com/) for free weather and geocoding data.
-   Uses [Gin](https://github.com/gin-gonic/gin) for routing.


example curl commands for backend

1. Current Weather
curl "http://localhost:8080/api/weather?lat=13.0827&lon=80.2707"

Using biome:

curl "http://localhost:8080/api/weather?biome=plains"
2. Hourly Forecast (24 hours)
curl "http://localhost:8080/api/weather/hourly?lat=13.0827&lon=80.2707"
3. Daily Forecast (7 days)
curl "http://localhost:8080/api/weather/daily?lat=13.0827&lon=80.2707"
4. Historical Weather
curl "http://localhost:8080/api/weather/historical?lat=13.0827&lon=80.2707&start_date=2025-03-01&end_date=2025-03-07"
5. Geocoding (City → Coordinates)
curl "http://localhost:8080/api/geocoding/search?name=Chennai"
6. Air Quality
curl "http://localhost:8080/api/air-quality?lat=13.0827&lon=80.2707"