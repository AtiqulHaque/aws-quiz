import { Question } from '@/types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    question: "Which of the following is NOT supported by Amazon RDS?",
    options: ["Automatic backups", "SSH access to the database instance", "Read replicas", "Multi-AZ deployments"],
    correctAnswer: 1,
    explanation: "Amazon RDS does not provide SSH access to the database instance. It's a managed service where AWS handles the underlying infrastructure."
  },
  {
    id: 2,
    question: "What is the primary difference between Amazon RDS and Amazon Aurora?",
    options: ["Aurora supports only NoSQL databases", "Aurora is fully serverless", "Aurora provides up to 5 times the throughput of MySQL on the same hardware", "Aurora does not support backups"],
    correctAnswer: 2,
    explanation: "Aurora is designed to provide up to 5 times the throughput of MySQL on the same hardware, making it significantly more performant than standard RDS."
  },
  {
    id: 3,
    question: "Which Amazon RDS feature provides high availability and failover support?",
    options: ["Read Replica", "Multi-AZ deployment", "Cross-region replication", "DB parameter group"],
    correctAnswer: 1,
    explanation: "Multi-AZ deployment provides high availability and automatic failover support by maintaining a standby instance in a different Availability Zone."
  },
  {
    id: 4,
    question: "You need to horizontally scale read traffic from your RDS database. Which feature should you use?",
    options: ["Multi-AZ deployment", "Read Replica", "Database snapshots", "IAM authentication"],
    correctAnswer: 1,
    explanation: "Read Replicas allow you to horizontally scale read traffic by creating copies of your database that can handle read requests."
  },
  {
    id: 5,
    question: "Which statement about Amazon Aurora is TRUE?",
    options: ["Aurora stores data in a single Availability Zone", "Aurora automatically replicates six copies of your data across three Availability Zones", "Aurora does not support cross-region replication", "Aurora does not support PostgreSQL"],
    correctAnswer: 1,
    explanation: "Aurora automatically replicates six copies of your data across three Availability Zones, providing high durability and availability."
  },
  {
    id: 6,
    question: "You want to migrate an on-premises Oracle DB to AWS with minimal code change. Which RDS engine should you choose?",
    options: ["Amazon Aurora MySQL", "Amazon RDS PostgreSQL", "Amazon RDS Oracle", "Amazon DynamoDB"],
    correctAnswer: 2,
    explanation: "Amazon RDS Oracle would require minimal code changes since you're migrating from Oracle to Oracle."
  },
  {
    id: 7,
    question: "Which Aurora feature provides automatic failover and automatic scaling of compute capacity?",
    options: ["Aurora Multi-Master", "Aurora Serverless v2", "Aurora Global Database", "Aurora Read Replica"],
    correctAnswer: 1,
    explanation: "Aurora Serverless v2 provides automatic failover and automatic scaling of compute capacity based on demand."
  },
  {
    id: 8,
    question: "Which of the following is a valid use case for Amazon Aurora Global Databases?",
    options: ["Single region analytics", "Multi-region write operations", "Disaster recovery with cross-region read replicas", "In-memory caching"],
    correctAnswer: 2,
    explanation: "Aurora Global Databases are designed for disaster recovery with cross-region read replicas, providing global read scaling and disaster recovery."
  },
  {
    id: 9,
    question: "What happens to backups when you delete an RDS instance?",
    options: ["All backups are retained", "You are given an option to create a final snapshot", "Backups are automatically stored in S3", "Backups are transferred to Glacier"],
    correctAnswer: 1,
    explanation: "When you delete an RDS instance, you are given an option to create a final snapshot before deletion."
  },
  {
    id: 10,
    question: "Which of the following can be encrypted using AWS KMS in Amazon RDS?",
    options: ["Only backups", "Only the database instance", "Data at rest including backups, snapshots, and replicas", "Only log files"],
    correctAnswer: 2,
    explanation: "AWS KMS can encrypt data at rest including backups, snapshots, and replicas in Amazon RDS."
  },
  {
    id: 11,
    question: "Which of the following databases are supported by Amazon Aurora?",
    options: ["MySQL and MongoDB", "MySQL and PostgreSQL", "Oracle and SQL Server", "DynamoDB and MySQL"],
    correctAnswer: 1,
    explanation: "Amazon Aurora supports MySQL and PostgreSQL database engines."
  },
  {
    id: 12,
    question: "What is the maximum number of Read Replicas you can create for an RDS MySQL DB instance?",
    options: ["2", "5", "15", "Unlimited"],
    correctAnswer: 2,
    explanation: "You can create up to 15 Read Replicas for an RDS MySQL DB instance."
  },
  {
    id: 13,
    question: "Which AWS service is best suited for running a highly available, PostgreSQL-compatible relational database with minimal maintenance?",
    options: ["Amazon RDS for PostgreSQL", "Amazon EC2 with PostgreSQL", "Amazon Aurora PostgreSQL", "Amazon Redshift"],
    correctAnswer: 2,
    explanation: "Amazon Aurora PostgreSQL is best suited for running a highly available, PostgreSQL-compatible relational database with minimal maintenance."
  },
  {
    id: 14,
    question: "Which of the following can be used to monitor Amazon RDS performance metrics?",
    options: ["AWS Config", "CloudTrail", "CloudWatch", "AWS Budgets"],
    correctAnswer: 2,
    explanation: "CloudWatch can be used to monitor Amazon RDS performance metrics and set up alarms."
  },
  {
    id: 15,
    question: "How can you enable automatic failover in Amazon RDS?",
    options: ["Enable read replicas", "Use DB parameter groups", "Create a Multi-AZ deployment", "Enable backup retention"],
    correctAnswer: 2,
    explanation: "Creating a Multi-AZ deployment enables automatic failover in Amazon RDS."
  },
  {
    id: 16,
    question: "Which of the following best describes Aurora Global Databases?",
    options: ["Supports multi-region read and write operations", "Allows writes in one AWS Region and reads in others", "Only available in single-region setups", "Supports DynamoDB-compatible storage"],
    correctAnswer: 1,
    explanation: "Aurora Global Databases allow writes in one AWS Region and reads in others, providing global read scaling."
  },
  {
    id: 17,
    question: "What is the default backup retention period for an RDS instance?",
    options: ["0 days", "1 day", "7 days", "30 days"],
    correctAnswer: 2,
    explanation: "The default backup retention period for an RDS instance is 7 days."
  },
  {
    id: 18,
    question: "Which Amazon RDS engine supports Microsoft SQL Server?",
    options: ["Aurora", "PostgreSQL", "Oracle", "SQL Server"],
    correctAnswer: 3,
    explanation: "Amazon RDS supports Microsoft SQL Server as one of its database engines."
  },
  {
    id: 19,
    question: "What kind of replication is used in Amazon RDS Read Replicas?",
    options: ["Synchronous", "Asynchronous", "Bidirectional", "Real-time mirroring"],
    correctAnswer: 1,
    explanation: "Amazon RDS Read Replicas use asynchronous replication."
  },
  {
    id: 20,
    question: "Which of the following statements about Amazon Aurora Serverless v2 is TRUE?",
    options: ["It only supports MySQL 5.6", "It requires manual scaling of compute capacity", "It supports fine-grained compute scaling with high availability", "It cannot be paused"],
    correctAnswer: 2,
    explanation: "Aurora Serverless v2 supports fine-grained compute scaling with high availability, automatically scaling based on demand."
  }
];

export function getRandomQuestions(count: number = 10): Question[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getQuestionById(id: number): Question | undefined {
  return questions.find(q => q.id === id);
} 