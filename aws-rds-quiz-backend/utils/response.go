package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response represents a standardized API response
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// SuccessResponse returns a successful response
func SuccessResponse(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// ErrorResponse returns an error response
func ErrorResponse(c *gin.Context, statusCode int, error string) {
	c.JSON(statusCode, Response{
		Success: false,
		Error:   error,
	})
}

// BadRequestResponse returns a 400 Bad Request response
func BadRequestResponse(c *gin.Context, error string) {
	ErrorResponse(c, http.StatusBadRequest, error)
}

// NotFoundResponse returns a 404 Not Found response
func NotFoundResponse(c *gin.Context, error string) {
	ErrorResponse(c, http.StatusNotFound, error)
}

// InternalServerErrorResponse returns a 500 Internal Server Error response
func InternalServerErrorResponse(c *gin.Context, error string) {
	ErrorResponse(c, http.StatusInternalServerError, error)
}

// ValidationErrorResponse returns a 422 Unprocessable Entity response
func ValidationErrorResponse(c *gin.Context, error string) {
	ErrorResponse(c, http.StatusUnprocessableEntity, error)
}
