package main

import (
	"log"
	"net/http"

	"aws-rds-quiz-backend/config"
	"aws-rds-quiz-backend/database"
	"aws-rds-quiz-backend/handlers"
	"aws-rds-quiz-backend/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize database
	db, err := database.InitDB(cfg.Database)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Set Gin mode
	gin.SetMode(gin.ReleaseMode)

	// Create router
	r := gin.Default()

	// Add middleware
	r.Use(middleware.CORS(cfg.CORS))
	r.Use(middleware.Logger())

	// Health check endpoint
	r.GET("/health", handlers.HealthCheck)

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Questions endpoints
		v1.GET("/questions", handlers.GetAllQuestions(db))
		v1.GET("/questions/random", handlers.GetRandomQuestions(db))
		v1.GET("/questions/:id", handlers.GetQuestionByID(db))

		// Quiz endpoints
		v1.POST("/quiz/submit", handlers.SubmitQuiz(db))
		v1.GET("/quiz/results/:id", handlers.GetQuizResult(db))
	}

	// Start server
	serverAddr := cfg.Server.Host + ":" + cfg.Server.Port
	log.Printf("Server starting on %s", serverAddr)

	if err := http.ListenAndServe(serverAddr, r); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
