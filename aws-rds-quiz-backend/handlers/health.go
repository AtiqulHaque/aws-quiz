package handlers

import (
	"aws-rds-quiz-backend/utils"

	"github.com/gin-gonic/gin"
)

// HealthCheck handles health check requests
func HealthCheck(c *gin.Context) {
	utils.SuccessResponse(c, gin.H{
		"status":  "healthy",
		"service": "aws-rds-quiz-backend",
		"version": "1.0.0",
	}, "Service is healthy")
}
