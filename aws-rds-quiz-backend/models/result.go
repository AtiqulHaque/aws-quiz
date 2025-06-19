package models

import (
	"time"
)

// QuizResult represents the detailed result of a quiz submission
type QuizResult struct {
	ID             uint               `json:"id"`
	UserID         string             `json:"userId"`
	Score          int                `json:"score"`
	Total          int                `json:"total"`
	Percentage     float64            `json:"percentage"`
	CorrectAnswers int                `json:"correctAnswers"`
	WrongAnswers   int                `json:"wrongAnswers"`
	TimeSpent      int64              `json:"timeSpent"`
	Answers        []QuizAnswerDetail `json:"answers"`
	Grade          string             `json:"grade"`
	CreatedAt      time.Time          `json:"createdAt"`
}

// QuizStats represents aggregated statistics
type QuizStats struct {
	TotalSubmissions int     `json:"totalSubmissions"`
	AverageScore     float64 `json:"averageScore"`
	AverageTime      float64 `json:"averageTime"`
	HighestScore     int     `json:"highestScore"`
	LowestScore      int     `json:"lowestScore"`
}

// GetGrade returns the letter grade based on percentage
func (r *QuizResult) GetGrade() string {
	switch {
	case r.Percentage >= 90:
		return "A"
	case r.Percentage >= 80:
		return "B"
	case r.Percentage >= 70:
		return "C"
	case r.Percentage >= 60:
		return "D"
	default:
		return "F"
	}
}

// CalculateStats calculates additional statistics
func (r *QuizResult) CalculateStats() {
	r.CorrectAnswers = 0
	r.WrongAnswers = 0

	for _, answer := range r.Answers {
		if answer.IsCorrect {
			r.CorrectAnswers++
		} else {
			r.WrongAnswers++
		}
	}

	r.Grade = r.GetGrade()
}
