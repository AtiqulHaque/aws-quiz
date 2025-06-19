const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: string;
}

export interface QuizSubmission {
  userId: string;
  answers: { questionId: number; selectedAnswer: number }[];
  timeSpent: number;
}

export interface QuizResult {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  timeSpent: number;
  submittedAt: string;
  answers: {
    questionId: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }

  // Get all questions
  async getAllQuestions(): Promise<ApiResponse<Question[]>> {
    return this.request('/api/v1/questions');
  }

  // Get random questions
  async getRandomQuestions(count: number = 10): Promise<ApiResponse<Question[]>> {
    return this.request(`/api/v1/questions/random?count=${count}`);
  }

  // Get question by ID
  async getQuestionById(id: number): Promise<ApiResponse<Question>> {
    return this.request(`/api/v1/questions/${id}`);
  }

  // Submit quiz
  async submitQuiz(submission: QuizSubmission): Promise<ApiResponse<{ resultId: string }>> {
    return this.request('/api/v1/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  // Get quiz result
  async getQuizResult(resultId: string): Promise<ApiResponse<QuizResult>> {
    return this.request(`/api/v1/quiz/results/${resultId}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 