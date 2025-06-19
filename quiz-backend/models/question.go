package models

import (
	"time"

	"gorm.io/gorm"
)

type Question struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	Question      string         `json:"question" gorm:"not null"`
	Options       string         `json:"options" gorm:"type:text;not null"` // JSON array as string
	CorrectAnswer int            `json:"correctAnswer" gorm:"not null"`
	Explanation   string         `json:"explanation" gorm:"type:text"`
	Category      string         `json:"category" gorm:"default:'RDS'"`
	Difficulty    string         `json:"difficulty" gorm:"default:'medium'"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `json:"deletedAt,omitempty" gorm:"index"`
}

// QuestionResponse represents the API response format
type QuestionResponse struct {
	ID            uint     `json:"id"`
	Question      string   `json:"question"`
	Options       []string `json:"options"`
	CorrectAnswer int      `json:"correctAnswer"`
	Explanation   string   `json:"explanation,omitempty"`
	Category      string   `json:"category"`
	Difficulty    string   `json:"difficulty"`
}

// QuestionRequest represents the API request format for creating/updating questions
type QuestionRequest struct {
	Question      string   `json:"question" binding:"required"`
	Options       []string `json:"options" binding:"required,min=2,max=6"`
	CorrectAnswer int      `json:"correctAnswer" binding:"required,min=0"`
	Explanation   string   `json:"explanation"`
	Category      string   `json:"category"`
	Difficulty    string   `json:"difficulty"`
}

// TableName specifies the table name for the Question model
func (Question) TableName() string {
	return "questions"
}
