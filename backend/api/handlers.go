package api

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type WeatherHandler struct {
	weatherService *services.OpenMeteoService
}

func NewWeatherHandler(ws *services.OpenMeteoService) *WeatherHandler {
	return &WeatherHandler{weatherService: ws}
}

var biomeLocations = map[models.Biome]struct{ Lat, Long float64 }{
	models.Plains: {Lat: 39.09, Long: -94.57},
	models.Desert: {Lat: 30.04, Long: 31.23},
	models.Taiga:  {Lat: 62.03, Long: 129.74},
	models.Jungle: {Lat: -3.11, Long: -60.02},
}

func (h *WeatherHandler) GetWeather(c *gin.Context) {
	biome := models.Biome(c.Query("biome"))
	latStr := c.Query("lat")
	lonStr := c.Query("lon")

	var lat, lon float64
	var err error

	if latStr != "" && lonStr != "" {
		lat, _ = strconv.ParseFloat(latStr, 64)
		lon, _ = strconv.ParseFloat(lonStr, 64)
	} else {
		if biome == "" {
			biome = models.Plains
		}
		loc, ok := biomeLocations[biome]
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid biome"})
			return
		}
		lat = loc.Lat
		lon = loc.Long
	}

	resp, err := h.weatherService.FetchWeather(lat, lon)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch weather"})
		return
	}
	resp.Time = time.Now().Format(time.RFC3339)
	c.JSON(http.StatusOK, resp)
}

func (h *WeatherHandler) GetHourly(c *gin.Context) {
	lat, _ := strconv.ParseFloat(c.Query("lat"), 64)
	lon, _ := strconv.ParseFloat(c.Query("lon"), 64)

	resp, err := h.weatherService.FetchHourly(lat, lon)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch hourly forecast"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *WeatherHandler) GetDaily(c *gin.Context) {
	lat, _ := strconv.ParseFloat(c.Query("lat"), 64)
	lon, _ := strconv.ParseFloat(c.Query("lon"), 64)

	resp, err := h.weatherService.FetchDaily(lat, lon)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch daily forecast"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *WeatherHandler) GetAirQuality(c *gin.Context) {
	lat, _ := strconv.ParseFloat(c.Query("lat"), 64)
	lon, _ := strconv.ParseFloat(c.Query("lon"), 64)

	resp, err := h.weatherService.FetchAirQuality(lat, lon)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch air quality data"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *WeatherHandler) GetHistorical(c *gin.Context) {
	lat, _ := strconv.ParseFloat(c.Query("lat"), 64)
	lon, _ := strconv.ParseFloat(c.Query("lon"), 64)
	start := c.Query("start_date")
	end := c.Query("end_date")

	if start == "" || end == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date and end_date are required"})
		return
	}

	resp, err := h.weatherService.FetchHistorical(lat, lon, start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch historical data"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *WeatherHandler) SearchGeocoding(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name parameter is required"})
		return
	}

	resp, err := h.weatherService.SearchGeocoding(name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search locations"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *WeatherHandler) OverrideWeather(c *gin.Context) {
	var req struct {
		State models.WeatherState `json:"state"`
		Biome models.Biome        `json:"biome"`
		Lat   float64             `json:"lat"`
		Lon   float64             `json:"lon"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	lat, lon := req.Lat, req.Lon
	if lat == 0 && lon == 0 {
		loc := biomeLocations[req.Biome]
		lat, lon = loc.Lat, loc.Long
	}

	resp, err := h.weatherService.FetchWeather(lat, lon)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch base data"})
		return
	}

	resp.State = req.State
	resp.Time = time.Now().Format(time.RFC3339)
	c.JSON(http.StatusOK, resp)
}
