package middleware

import (
	"aws-rds-quiz-backend/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORS middleware configuration
func CORS(cfg config.CORSConfig) gin.HandlerFunc {
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = cfg.AllowedOrigins
	corsConfig.AllowMethods = cfg.AllowedMethods
	corsConfig.AllowHeaders = cfg.AllowedHeaders
	corsConfig.AllowCredentials = true

	return cors.New(corsConfig)
}
