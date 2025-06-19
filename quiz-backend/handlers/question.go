package handlers

import (
	"encoding/json"
	"math/rand"
	"strconv"
	"time"

	"aws-rds-quiz-backend/models"
	"aws-rds-quiz-backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GetAllQuestions returns all questions
func GetAllQuestions(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var questions []models.Question

		if err := db.Find(&questions).Error; err != nil {
			utils.InternalServerErrorResponse(c, "Failed to fetch questions")
			return
		}

		// Convert to response format
		var responses []models.QuestionResponse
		for _, q := range questions {
			var options []string
			if err := json.Unmarshal([]byte(q.Options), &options); err != nil {
				utils.InternalServerErrorResponse(c, "Failed to parse question options")
				return
			}

			responses = append(responses, models.QuestionResponse{
				ID:            q.ID,
				Question:      q.Question,
				Options:       options,
				CorrectAnswer: q.CorrectAnswer,
				Explanation:   q.Explanation,
				Category:      q.Category,
				Difficulty:    q.Difficulty,
			})
		}

		utils.SuccessResponse(c, responses, "Questions retrieved successfully")
	}
}

// GetRandomQuestions returns random questions
func GetRandomQuestions(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		countStr := c.DefaultQuery("count", "10")
		count, err := strconv.Atoi(countStr)
		if err != nil || count <= 0 || count > 50 {
			utils.BadRequestResponse(c, "Invalid count parameter. Must be between 1 and 50")
			return
		}

		var questions []models.Question
		if err := db.Find(&questions).Error; err != nil {
			utils.InternalServerErrorResponse(c, "Failed to fetch questions")
			return
		}

		// Shuffle questions
		rand.Seed(time.Now().UnixNano())
		rand.Shuffle(len(questions), func(i, j int) {
			questions[i], questions[j] = questions[j], questions[i]
		})

		// Limit to requested count
		if count > len(questions) {
			count = len(questions)
		}
		questions = questions[:count]

		// Convert to response format
		var responses []models.QuestionResponse
		for _, q := range questions {
			var options []string
			if err := json.Unmarshal([]byte(q.Options), &options); err != nil {
				utils.InternalServerErrorResponse(c, "Failed to parse question options")
				return
			}

			responses = append(responses, models.QuestionResponse{
				ID:            q.ID,
				Question:      q.Question,
				Options:       options,
				CorrectAnswer: q.CorrectAnswer,
				Explanation:   q.Explanation,
				Category:      q.Category,
				Difficulty:    q.Difficulty,
			})
		}

		utils.SuccessResponse(c, responses, "Random questions retrieved successfully")
	}
}

// GetQuestionByID returns a specific question by ID
func GetQuestionByID(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 32)
		if err != nil {
			utils.BadRequestResponse(c, "Invalid question ID")
			return
		}

		var question models.Question
		if err := db.First(&question, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				utils.NotFoundResponse(c, "Question not found")
				return
			}
			utils.InternalServerErrorResponse(c, "Failed to fetch question")
			return
		}

		// Convert to response format
		var options []string
		if err := json.Unmarshal([]byte(question.Options), &options); err != nil {
			utils.InternalServerErrorResponse(c, "Failed to parse question options")
			return
		}

		response := models.QuestionResponse{
			ID:            question.ID,
			Question:      question.Question,
			Options:       options,
			CorrectAnswer: question.CorrectAnswer,
			Explanation:   question.Explanation,
			Category:      question.Category,
			Difficulty:    question.Difficulty,
		}

		utils.SuccessResponse(c, response, "Question retrieved successfully")
	}
}
