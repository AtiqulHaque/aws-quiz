package database

import (
	"encoding/json"
	"fmt"
	"log"

	"aws-rds-quiz-backend/config"
	"aws-rds-quiz-backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDB initializes the database connection
func InitDB(cfg config.DatabaseConfig) (*gorm.DB, error) {
	var dsn string

	switch cfg.Driver {
	case "sqlite":
		dsn = cfg.DBName
	default:
		return nil, fmt.Errorf("unsupported database driver: %s", cfg.Driver)
	}

	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// Auto migrate the schema
	if err := db.AutoMigrate(&models.Question{}, &models.QuizSubmission{}); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %v", err)
	}

	DB = db
	log.Println("Database connected successfully")

	// Seed initial data if database is empty
	if err := seedQuestions(db); err != nil {
		log.Printf("Warning: Failed to seed questions: %v", err)
	}

	return db, nil
}

// seedQuestions seeds the database with initial questions
func seedQuestions(db *gorm.DB) error {
	var count int64
	db.Model(&models.Question{}).Count(&count)

	if count > 0 {
		return nil // Database already has questions
	}

	questions := getInitialQuestions()

	for _, q := range questions {
		optionsJSON, err := json.Marshal(q.Options)
		if err != nil {
			return fmt.Errorf("failed to marshal options: %v", err)
		}

		question := models.Question{
			Question:      q.Question,
			Options:       string(optionsJSON),
			CorrectAnswer: q.CorrectAnswer,
			Explanation:   q.Explanation,
			Category:      q.Category,
			Difficulty:    q.Difficulty,
		}

		if err := db.Create(&question).Error; err != nil {
			return fmt.Errorf("failed to create question: %v", err)
		}
	}

	log.Printf("Seeded %d questions successfully", len(questions))
	return nil
}

// getInitialQuestions returns the initial set of questions
func getInitialQuestions() []struct {
	Question      string
	Options       []string
	CorrectAnswer int
	Explanation   string
	Category      string
	Difficulty    string
} {
	return []struct {
		Question      string
		Options       []string
		CorrectAnswer int
		Explanation   string
		Category      string
		Difficulty    string
	}{
		{
			Question:      "Which of the following is NOT supported by Amazon RDS?",
			Options:       []string{"Automatic backups", "SSH access to the database instance", "Read replicas", "Multi-AZ deployments"},
			CorrectAnswer: 1,
			Explanation:   "Amazon RDS does not provide SSH access to the database instance. It's a managed service where AWS handles the underlying infrastructure.",
			Category:      "RDS",
			Difficulty:    "medium",
		},
		{
			Question:      "What is the primary difference between Amazon RDS and Amazon Aurora?",
			Options:       []string{"Aurora supports only NoSQL databases", "Aurora is fully serverless", "Aurora provides up to 5 times the throughput of MySQL on the same hardware", "Aurora does not support backups"},
			CorrectAnswer: 2,
			Explanation:   "Aurora is designed to provide up to 5 times the throughput of MySQL on the same hardware, making it significantly more performant than standard RDS.",
			Category:      "Aurora",
			Difficulty:    "medium",
		},
		{
			Question:      "Which Amazon RDS feature provides high availability and failover support?",
			Options:       []string{"Read Replica", "Multi-AZ deployment", "Cross-region replication", "DB parameter group"},
			CorrectAnswer: 1,
			Explanation:   "Multi-AZ deployment provides high availability and automatic failover support by maintaining a standby instance in a different Availability Zone.",
			Category:      "RDS",
			Difficulty:    "easy",
		},
		{
			Question:      "You need to horizontally scale read traffic from your RDS database. Which feature should you use?",
			Options:       []string{"Multi-AZ deployment", "Read Replica", "Database snapshots", "IAM authentication"},
			CorrectAnswer: 1,
			Explanation:   "Read Replicas allow you to horizontally scale read traffic by creating copies of your database that can handle read requests.",
			Category:      "RDS",
			Difficulty:    "medium",
		},
		{
			Question:      "Which statement about Amazon Aurora is TRUE?",
			Options:       []string{"Aurora stores data in a single Availability Zone", "Aurora automatically replicates six copies of your data across three Availability Zones", "Aurora does not support cross-region replication", "Aurora does not support PostgreSQL"},
			CorrectAnswer: 1,
			Explanation:   "Aurora automatically replicates six copies of your data across three Availability Zones, providing high durability and availability.",
			Category:      "Aurora",
			Difficulty:    "medium",
		},
		{
			Question:      "You want to migrate an on-premises Oracle DB to AWS with minimal code change. Which RDS engine should you choose?",
			Options:       []string{"Amazon Aurora MySQL", "Amazon RDS PostgreSQL", "Amazon RDS Oracle", "Amazon DynamoDB"},
			CorrectAnswer: 2,
			Explanation:   "Amazon RDS Oracle would require minimal code changes since you're migrating from Oracle to Oracle.",
			Category:      "RDS",
			Difficulty:    "easy",
		},
		{
			Question:      "Which Aurora feature provides automatic failover and automatic scaling of compute capacity?",
			Options:       []string{"Aurora Multi-Master", "Aurora Serverless v2", "Aurora Global Database", "Aurora Read Replica"},
			CorrectAnswer: 1,
			Explanation:   "Aurora Serverless v2 provides automatic failover and automatic scaling of compute capacity based on demand.",
			Category:      "Aurora",
			Difficulty:    "hard",
		},
		{
			Question:      "Which of the following is a valid use case for Amazon Aurora Global Databases?",
			Options:       []string{"Single region analytics", "Multi-region write operations", "Disaster recovery with cross-region read replicas", "In-memory caching"},
			CorrectAnswer: 2,
			Explanation:   "Aurora Global Databases are designed for disaster recovery with cross-region read replicas, providing global read scaling and disaster recovery.",
			Category:      "Aurora",
			Difficulty:    "hard",
		},
		{
			Question:      "What happens to backups when you delete an RDS instance?",
			Options:       []string{"All backups are retained", "You are given an option to create a final snapshot", "Backups are automatically stored in S3", "Backups are transferred to Glacier"},
			CorrectAnswer: 1,
			Explanation:   "When you delete an RDS instance, you are given an option to create a final snapshot before deletion.",
			Category:      "RDS",
			Difficulty:    "medium",
		},
		{
			Question:      "Which of the following can be encrypted using AWS KMS in Amazon RDS?",
			Options:       []string{"Only backups", "Only the database instance", "Data at rest including backups, snapshots, and replicas", "Only log files"},
			CorrectAnswer: 2,
			Explanation:   "AWS KMS can encrypt data at rest including backups, snapshots, and replicas in Amazon RDS.",
			Category:      "RDS",
			Difficulty:    "medium",
		},
		{
			Question:      "Which of the following databases are supported by Amazon Aurora?",
			Options:       []string{"MySQL and MongoDB", "MySQL and PostgreSQL", "Oracle and SQL Server", "DynamoDB and MySQL"},
			CorrectAnswer: 1,
			Explanation:   "Amazon Aurora supports MySQL and PostgreSQL database engines.",
			Category:      "Aurora",
			Difficulty:    "easy",
		},
		{
			Question:      "What is the maximum number of Read Replicas you can create for an RDS MySQL DB instance?",
			Options:       []string{"2", "5", "15", "Unlimited"},
			CorrectAnswer: 2,
			Explanation:   "You can create up to 15 Read Replicas for an RDS MySQL DB instance.",
			Category:      "RDS",
			Difficulty:    "medium",
		},
		{
			Question:      "Which AWS service is best suited for running a highly available, PostgreSQL-compatible relational database with minimal maintenance?",
			Options:       []string{"Amazon RDS for PostgreSQL", "Amazon EC2 with PostgreSQL", "Amazon Aurora PostgreSQL", "Amazon Redshift"},
			CorrectAnswer: 2,
			Explanation:   "Amazon Aurora PostgreSQL is best suited for running a highly available, PostgreSQL-compatible relational database with minimal maintenance.",
			Category:      "Aurora",
			Difficulty:    "medium",
		},
		{
			Question:      "Which of the following can be used to monitor Amazon RDS performance metrics?",
			Options:       []string{"AWS Config", "CloudTrail", "CloudWatch", "AWS Budgets"},
			CorrectAnswer: 2,
			Explanation:   "CloudWatch can be used to monitor Amazon RDS performance metrics and set up alarms.",
			Category:      "RDS",
			Difficulty:    "easy",
		},
		{
			Question:      "How can you enable automatic failover in Amazon RDS?",
			Options:       []string{"Enable read replicas", "Use DB parameter groups", "Create a Multi-AZ deployment", "Enable backup retention"},
			CorrectAnswer: 2,
			Explanation:   "Creating a Multi-AZ deployment enables automatic failover in Amazon RDS.",
			Category:      "RDS",
			Difficulty:    "medium",
		},
		{
			Question:      "Which of the following best describes Aurora Global Databases?",
			Options:       []string{"Supports multi-region read and write operations", "Allows writes in one AWS Region and reads in others", "Only available in single-region setups", "Supports DynamoDB-compatible storage"},
			CorrectAnswer: 1,
			Explanation:   "Aurora Global Databases allow writes in one AWS Region and reads in others, providing global read scaling.",
			Category:      "Aurora",
			Difficulty:    "hard",
		},
		{
			Question:      "What is the default backup retention period for an RDS instance?",
			Options:       []string{"0 days", "1 day", "7 days", "30 days"},
			CorrectAnswer: 2,
			Explanation:   "The default backup retention period for an RDS instance is 7 days.",
			Category:      "RDS",
			Difficulty:    "easy",
		},
		{
			Question:      "Which Amazon RDS engine supports Microsoft SQL Server?",
			Options:       []string{"Aurora", "PostgreSQL", "Oracle", "SQL Server"},
			CorrectAnswer: 3,
			Explanation:   "Amazon RDS supports Microsoft SQL Server as one of its database engines.",
			Category:      "RDS",
			Difficulty:    "easy",
		},
		{
			Question:      "What kind of replication is used in Amazon RDS Read Replicas?",
			Options:       []string{"Synchronous", "Asynchronous", "Bidirectional", "Real-time mirroring"},
			CorrectAnswer: 1,
			Explanation:   "Amazon RDS Read Replicas use asynchronous replication.",
			Category:      "RDS",
			Difficulty:    "medium",
		},
		{
			Question:      "Which of the following statements about Amazon Aurora Serverless v2 is TRUE?",
			Options:       []string{"It only supports MySQL 5.6", "It requires manual scaling of compute capacity", "It supports fine-grained compute scaling with high availability", "It cannot be paused"},
			CorrectAnswer: 2,
			Explanation:   "Aurora Serverless v2 supports fine-grained compute scaling with high availability, automatically scaling based on demand.",
			Category:      "Aurora",
			Difficulty:    "hard",
		},
	}
}
