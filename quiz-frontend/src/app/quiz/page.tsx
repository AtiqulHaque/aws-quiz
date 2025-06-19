'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import QuizCard from '@/components/QuizCard';
import ProgressBar from '@/components/ProgressBar';
import { apiClient, Question, QuizSubmission } from '../../../lib/api';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
    setStartTime(Date.now());
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getRandomQuestions(10);
      if (response.success) {
        setQuestions(response.data);
      } else {
        setError('Failed to load questions');
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setError('Failed to load questions. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setIsAnswered(true);
    setShowCorrectAnswer(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswered(false);
      setShowCorrectAnswer(false);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = async () => {
    const timeSpent = Date.now() - startTime;
    
    try {
      // Convert answers to the format expected by the API
      const answerArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId: parseInt(questionId),
        selectedAnswer
      }));

      const submission: QuizSubmission = {
        userId: `user_${Date.now()}`, // Generate a simple user ID
        answers: answerArray,
        timeSpent
      };

      const response = await apiClient.submitQuiz(submission);
      if (response.success) {
        // Store results in sessionStorage for the results page
        sessionStorage.setItem('quizResultId', response.data.resultId);
        router.push('/results');
      } else {
        setError('Failed to submit quiz results');
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setError('Failed to submit quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Failed to load questions'}
          </h2>
          <button
            onClick={fetchQuestions}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
          score={score}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuizCard
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id] ?? null}
              onAnswerSelect={handleAnswerSelect}
              isAnswered={isAnswered}
              showCorrectAnswer={showCorrectAnswer}
            />
          </motion.div>
        </AnimatePresence>

        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 