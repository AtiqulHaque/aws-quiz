package config

import (
	"os"
	"strconv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	CORS     CORSConfig
}

type ServerConfig struct {
	Port string
	Host string
}

type DatabaseConfig struct {
	Driver   string
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type CORSConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
}

func LoadConfig() *Config {
	return &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", "8080"),
			Host: getEnv("HOST", "localhost"),
		},
		Database: DatabaseConfig{
			Driver:   getEnv("DB_DRIVER", "sqlite"),
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", ""),
			Password: getEnv("DB_PASSWORD", ""),
			DBName:   getEnv("DB_NAME", "quiz.db"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		CORS: CORSConfig{
			AllowedOrigins: []string{"http://localhost:3000", "http://localhost:3001"},
			AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowedHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
