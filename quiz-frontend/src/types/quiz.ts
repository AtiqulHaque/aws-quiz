export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizSubmission {
  answers: { [questionId: number]: number };
  timeSpent: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  answers: {
    questionId: number;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    question: string;
    selectedOption: string;
    correctOption: string;
  }[];
} 