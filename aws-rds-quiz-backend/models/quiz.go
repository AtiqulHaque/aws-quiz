package models

import (
	"time"

	"gorm.io/gorm"
)

type QuizSubmission struct {
	ID         uint           `json:"id" gorm:"primaryKey"`
	UserID     string         `json:"userId" gorm:"index"`
	Answers    string         `json:"answers" gorm:"type:text;not null"` // JSON object as string
	TimeSpent  int64          `json:"timeSpent" gorm:"not null"`         // Time in milliseconds
	Score      int            `json:"score" gorm:"not null"`
	Total      int            `json:"total" gorm:"not null"`
	Percentage float64        `json:"percentage" gorm:"not null"`
	CreatedAt  time.Time      `json:"createdAt"`
	UpdatedAt  time.Time      `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt `json:"deletedAt,omitempty" gorm:"index"`
}

// QuizSubmissionRequest represents the API request format
type QuizSubmissionRequest struct {
	UserID    string         `json:"userId"`
	Answers   map[string]int `json:"answers" binding:"required"`
	TimeSpent int64          `json:"timeSpent" binding:"required,min=0"`
}

// QuizSubmissionResponse represents the API response format
type QuizSubmissionResponse struct {
	ID         uint               `json:"id"`
	UserID     string             `json:"userId"`
	Score      int                `json:"score"`
	Total      int                `json:"total"`
	Percentage float64            `json:"percentage"`
	TimeSpent  int64              `json:"timeSpent"`
	Answers    []QuizAnswerDetail `json:"answers"`
	CreatedAt  time.Time          `json:"createdAt"`
}

// QuizAnswerDetail represents individual answer details
type QuizAnswerDetail struct {
	QuestionID     uint   `json:"questionId"`
	UserAnswer     int    `json:"userAnswer"`
	CorrectAnswer  int    `json:"correctAnswer"`
	IsCorrect      bool   `json:"isCorrect"`
	Question       string `json:"question"`
	SelectedOption string `json:"selectedOption"`
	CorrectOption  string `json:"correctOption"`
}

// TableName specifies the table name for the QuizSubmission model
func (QuizSubmission) TableName() string {
	return "quiz_submissions"
}
