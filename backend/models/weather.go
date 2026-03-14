package models

import "time"

// WeatherState for Minecraft-style frontend mapping
type WeatherState string

const (
	Sunny  WeatherState = "sunny"
	Rainy  WeatherState = "rainy"
	Stormy WeatherState = "stormy"
	Snowy  WeatherState = "snowy"
)

type Biome string

const (
	Plains Biome = "plains"
	Desert Biome = "desert"
	Taiga  Biome = "taiga"
	Jungle Biome = "jungle"
)

type WeatherData struct {
	Desc       string  `json:"desc"`
	Temp       int     `json:"temp"`
	FeelsLike  string  `json:"feelsLike"`
	Visibility string  `json:"visibility"`
	UV         string  `json:"uv"`
	TempLevel  int     `json:"tempLevel"`
	Humidity   int     `json:"humidity"`
	Wind       int     `json:"wind"`
	AvgTemp    string  `json:"avgTemp"`
	AirDensity string  `json:"airDensity"`
	Rainfall   string  `json:"rainfall"`
	WindSpd    string  `json:"windSpd"`
	BgColor    string  `json:"bgColor"`
	IconColor  string  `json:"iconColor"`
	IconShadow string  `json:"iconShadow"`
}

type WeatherApiResponse struct {
	State       WeatherState `json:"state"`
	Data        WeatherData  `json:"data"`
	Coordinates struct {
		X float64 `json:"x"`
		Y float64 `json:"y"`
		Z float64 `json:"z"`
	} `json:"coordinates"`
	Time string `json:"time"`
}

// Open-Meteo specific models
type CurrentWeather struct {
	Time          time.Time `json:"time"`
	Temperature   float64   `json:"temperature"`
	WindSpeed     float64   `json:"wind_speed"`
	WindDirection int       `json:"wind_direction"`
	WeatherCode   int       `json:"weather_code"`
	IsDay         int       `json:"is_day"`
}

type HourlyForecast struct {
	Time               []string  `json:"time"`
	Temperature2m      []float64 `json:"temperature_2m"`
	RelativeHumidity2m []int     `json:"relative_humidity_2m"`
	Precipitation      []float64 `json:"precipitation"`
	WindSpeed10m       []float64 `json:"wind_speed_10m"`
	CloudCover         []int     `json:"cloud_cover"`
	SurfacePressure    []float64 `json:"surface_pressure"`
	Snowfall           []float64 `json:"snowfall"`
	Visibility         []float64 `json:"visibility"`
}

type DailyForecast struct {
	Time             []string  `json:"time"`
	Temperature2mMax []float64 `json:"temperature_2m_max"`
	Temperature2mMin []float64 `json:"temperature_2m_min"`
	Sunrise          []string  `json:"sunrise"`
	Sunset           []string  `json:"sunset"`
	PrecipitationSum []float64 `json:"precipitation_sum"`
	RainProbability  []int     `json:"precipitation_probability_max"`
	WindSpeed10mMax  []float64 `json:"wind_speed_10m_max"`
	UVIndexMax       []float64 `json:"uv_index_max"`
}

type AirQuality struct {
	Time      []string  `json:"time"`
	PM10      []float64 `json:"pm10"`
	PM25      []float64 `json:"pm2_5"`
	CO        []float64 `json:"carbon_monoxide"`
	NO2       []float64 `json:"nitrogen_dioxide"`
	Ozone     []float64 `json:"ozone"`
	SO2       []float64 `json:"sulphur_dioxide"`
	US_AQI    []int     `json:"us_aqi"`
}

type GeocodingResult struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Country   string  `json:"country"`
	Timezone  string  `json:"admin1"` // simplified
}

type GeocodingResponse struct {
	Results []GeocodingResult `json:"results"`
}
