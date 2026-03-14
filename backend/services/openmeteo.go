package services

import (
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"
)

type OpenMeteoService struct{}

func NewOpenMeteoService() *OpenMeteoService {
	return &OpenMeteoService{}
}

func (s *OpenMeteoService) FetchWeather(lat, lon float64) (*models.WeatherApiResponse, error) {
	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%.2f&longitude=%.2f&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=uv_index_max&timezone=auto&forecast_days=1", lat, lon)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Current struct {
			Temperature2m    float64 `json:"temperature_2m"`
			RelativeHumidity int     `json:"relative_humidity_2m"`
			ApparentTemp     float64 `json:"apparent_temperature"`
			Precipitation    float64 `json:"precipitation"`
			WeatherCode      int     `json:"weather_code"`
			WindSpeed10m     float64 `json:"wind_speed_10m"`
		} `json:"current"`
		Daily struct {
			UVIndexMax []float64 `json:"uv_index_max"`
		} `json:"daily"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	state := s.GetWeatherState(result.Current.WeatherCode)
	uvValue := 0.0
	if len(result.Daily.UVIndexMax) > 0 {
		uvValue = result.Daily.UVIndexMax[0]
	}

	visuals := s.GetWeatherVisuals(state)

	data := models.WeatherData{
		Desc:       "Real-time weather data.",
		Temp:       int(result.Current.Temperature2m),
		FeelsLike:  fmt.Sprintf("%.0f°C", result.Current.ApparentTemp),
		Visibility: "16 chunks",
		UV:         s.GetUVCategory(uvValue),
		TempLevel:  int((result.Current.Temperature2m + 20) * 1.5),
		Humidity:   result.Current.RelativeHumidity,
		Wind:       int(result.Current.WindSpeed10m * 2),
		AvgTemp:    fmt.Sprintf("%.1f°", result.Current.Temperature2m),
		Rainfall:   fmt.Sprintf("%.1f mm", result.Current.Precipitation),
		WindSpd:    fmt.Sprintf("%.0f km/h", result.Current.WindSpeed10m),
		BgColor:    visuals.BgColor,
		IconColor:  visuals.IconColor,
		IconShadow: visuals.IconShadow,
	}

	apiResp := &models.WeatherApiResponse{
		State: state,
		Data:  data,
		Time:  "", // set by caller if needed
	}
	apiResp.Coordinates.X = lat
	apiResp.Coordinates.Z = lon
	apiResp.Coordinates.Y = 64

	return apiResp, nil
}

func (s *OpenMeteoService) GetWeatherState(code int) models.WeatherState {
	switch {
	case code == 0, code == 1, code == 2, code == 3:
		return models.Sunny
	case code >= 51 && code <= 67, code >= 80 && code <= 82:
		return models.Rainy
	case code >= 71 && code <= 77, code >= 85 && code <= 86:
		return models.Snowy
	case code >= 95:
		return models.Stormy
	default:
		return models.Sunny
	}
}

func (s *OpenMeteoService) GetWeatherVisuals(state models.WeatherState) struct {
	BgColor, IconColor, IconShadow string
} {
	switch state {
	case models.Rainy:
		return struct{ BgColor, IconColor, IconShadow string }{"#0a0d14", "#4a4a4a", "0 0 20px rgba(0, 243, 255, 0.2)"}
	case models.Stormy:
		return struct{ BgColor, IconColor, IconShadow string }{"#050508", "#2d2d2d", "0 0 30px rgba(255, 77, 0, 0.3)"}
	case models.Snowy:
		return struct{ BgColor, IconColor, IconShadow string }{"#0d1117", "#e0f2fe", "0 0 30px rgba(255, 255, 255, 0.4)"}
	default:
		return struct{ BgColor, IconColor, IconShadow string }{"#121212", "#ffcc33", "0 0 30px rgba(255, 204, 51, 0.6)"}
	}
}

func (s *OpenMeteoService) GetUVCategory(uv float64) string {
	switch {
	case uv < 3:
		return "LOW"
	case uv < 6:
		return "MODERATE"
	case uv < 8:
		return "HIGH"
	case uv < 11:
		return "VERY HIGH"
	default:
		return "EXTREME"
	}
}

func (s *OpenMeteoService) FetchHourly(lat, lon float64) (*models.HourlyForecast, error) {
	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%.2f&longitude=%.2f&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,cloud_cover,surface_pressure,snowfall,visibility", lat, lon)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Hourly models.HourlyForecast `json:"hourly"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result.Hourly, nil
}

func (s *OpenMeteoService) FetchDaily(lat, lon float64) (*models.DailyForecast, error) {
	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%.2f&longitude=%.2f&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto", lat, lon)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Daily models.DailyForecast `json:"daily"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result.Daily, nil
}

func (s *OpenMeteoService) FetchAirQuality(lat, lon float64) (*models.AirQuality, error) {
	url := fmt.Sprintf("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=%.2f&longitude=%.2f&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide,us_aqi", lat, lon)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Hourly models.AirQuality `json:"hourly"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result.Hourly, nil
}

func (s *OpenMeteoService) FetchHistorical(lat, lon float64, start, end string) (*models.HourlyForecast, error) {
	url := fmt.Sprintf("https://archive-api.open-meteo.com/v1/archive?latitude=%.2f&longitude=%.2f&start_date=%s&end_date=%s&hourly=temperature_2m,precipitation,wind_speed_10m,surface_pressure", lat, lon, start, end)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Hourly models.HourlyForecast `json:"hourly"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result.Hourly, nil
}

func (s *OpenMeteoService) SearchGeocoding(name string) (*models.GeocodingResponse, error) {
	url := fmt.Sprintf("https://geocoding-api.open-meteo.com/v1/search?name=%s&count=10&language=en&format=json", name)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result models.GeocodingResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result, nil
}
