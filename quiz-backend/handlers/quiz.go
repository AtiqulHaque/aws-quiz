package handlers

import (
	"encoding/json"
	"strconv"

	"aws-rds-quiz-backend/models"
	"aws-rds-quiz-backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SubmitQuiz handles quiz submission, scoring, and result storage
func SubmitQuiz(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.QuizSubmissionRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			utils.ValidationErrorResponse(c, "Invalid request body")
			return
		}

		// Fetch all questions
		var questions []models.Question
		if err := db.Find(&questions).Error; err != nil {
			utils.InternalServerErrorResponse(c, "Failed to fetch questions")
			return
		}

		// Calculate score and build answer details
		var (
			score         int
			answerDetails []models.QuizAnswerDetail
		)
		total := len(req.Answers)
		for qidStr, userAnswer := range req.Answers {
			qid, err := strconv.ParseUint(qidStr, 10, 32)
			if err != nil {
				continue
			}
			var question models.Question
			if err := db.First(&question, qid).Error; err != nil {
				continue
			}
			var options []string
			_ = json.Unmarshal([]byte(question.Options), &options)
			isCorrect := userAnswer == question.CorrectAnswer
			if isCorrect {
				score++
			}
			answerDetails = append(answerDetails, models.QuizAnswerDetail{
				QuestionID:    question.ID,
				UserAnswer:    userAnswer,
				CorrectAnswer: question.CorrectAnswer,
				IsCorrect:     isCorrect,
				Question:      question.Question,
				SelectedOption: func() string {
					if userAnswer >= 0 && userAnswer < len(options) {
						return options[userAnswer]
					}
					return ""
				}(),
				CorrectOption: func() string {
					if question.CorrectAnswer >= 0 && question.CorrectAnswer < len(options) {
						return options[question.CorrectAnswer]
					}
					return ""
				}(),
			})
		}

		percentage := 0.0
		if total > 0 {
			percentage = float64(score) / float64(total) * 100
		}

		answersJSON, _ := json.Marshal(req.Answers)
		quiz := models.QuizSubmission{
			UserID:     req.UserID,
			Answers:    string(answersJSON),
			TimeSpent:  req.TimeSpent,
			Score:      score,
			Total:      total,
			Percentage: percentage,
		}
		if err := db.Create(&quiz).Error; err != nil {
			utils.InternalServerErrorResponse(c, "Failed to save quiz submission")
			return
		}

		resp := models.QuizSubmissionResponse{
			ID:         quiz.ID,
			UserID:     quiz.UserID,
			Score:      quiz.Score,
			Total:      quiz.Total,
			Percentage: quiz.Percentage,
			TimeSpent:  quiz.TimeSpent,
			Answers:    answerDetails,
			CreatedAt:  quiz.CreatedAt,
		}
		utils.SuccessResponse(c, resp, "Quiz submitted successfully")
	}
}

// GetQuizResult returns a quiz result by submission ID
func GetQuizResult(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 32)
		if err != nil {
			utils.BadRequestResponse(c, "Invalid quiz result ID")
			return
		}
		var quiz models.QuizSubmission
		if err := db.First(&quiz, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				utils.NotFoundResponse(c, "Quiz result not found")
				return
			}
			utils.InternalServerErrorResponse(c, "Failed to fetch quiz result")
			return
		}
		// Parse answers
		var answers map[string]int
		_ = json.Unmarshal([]byte(quiz.Answers), &answers)
		// Fetch all questions for details
		var answerDetails []models.QuizAnswerDetail
		for qidStr, userAnswer := range answers {
			qid, err := strconv.ParseUint(qidStr, 10, 32)
			if err != nil {
				continue
			}
			var question models.Question
			if err := db.First(&question, qid).Error; err != nil {
				continue
			}
			var options []string
			_ = json.Unmarshal([]byte(question.Options), &options)
			isCorrect := userAnswer == question.CorrectAnswer
			answerDetails = append(answerDetails, models.QuizAnswerDetail{
				QuestionID:    question.ID,
				UserAnswer:    userAnswer,
				CorrectAnswer: question.CorrectAnswer,
				IsCorrect:     isCorrect,
				Question:      question.Question,
				SelectedOption: func() string {
					if userAnswer >= 0 && userAnswer < len(options) {
						return options[userAnswer]
					}
					return ""
				}(),
				CorrectOption: func() string {
					if question.CorrectAnswer >= 0 && question.CorrectAnswer < len(options) {
						return options[question.CorrectAnswer]
					}
					return ""
				}(),
			})
		}
		resp := models.QuizSubmissionResponse{
			ID:         quiz.ID,
			UserID:     quiz.UserID,
			Score:      quiz.Score,
			Total:      quiz.Total,
			Percentage: quiz.Percentage,
			TimeSpent:  quiz.TimeSpent,
			Answers:    answerDetails,
			CreatedAt:  quiz.CreatedAt,
		}
		utils.SuccessResponse(c, resp, "Quiz result retrieved successfully")
	}
}
