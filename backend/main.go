package main

import (
	"backend/api"
	"backend/services"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	weatherService := services.NewOpenMeteoService()
	weatherHandler := api.NewWeatherHandler(weatherService)

	apiGroup := r.Group("/api")
	{
		apiGroup.GET("/weather", weatherHandler.GetWeather)
		apiGroup.GET("/weather/hourly", weatherHandler.GetHourly)
		apiGroup.GET("/weather/daily", weatherHandler.GetDaily)
		apiGroup.GET("/weather/historical", weatherHandler.GetHistorical)
		apiGroup.POST("/weather/override", weatherHandler.OverrideWeather)
		
		apiGroup.GET("/air-quality", weatherHandler.GetAirQuality)
		apiGroup.GET("/geocoding/search", weatherHandler.SearchGeocoding)
	}

	r.Run(":8080")
}
