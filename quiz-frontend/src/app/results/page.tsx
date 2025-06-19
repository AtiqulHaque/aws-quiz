'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ResultsChart from '@/components/ResultsChart';
import { apiClient, QuizResult } from '../../../lib/api';

export default function ResultsPage() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const resultId = sessionStorage.getItem('quizResultId');
      if (!resultId) {
        setError('No quiz result found. Please take the quiz first.');
        setLoading(false);
        return;
      }

      const response = await apiClient.getQuizResult(resultId);
      if (response.success) {
        setResult(response.data);
      } else {
        setError('Failed to load quiz results');
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
      setError('Failed to load quiz results. Please try again.');
    } finally {
      setLoading(false);
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

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'No results found'}
          </h2>
          <Link href="/quiz">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Take Quiz Again
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <ResultsChart result={result} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Detailed Results</h3>
          
          <div className="space-y-4">
            {result.answers.map((answer, index) => (
              <motion.div
                key={answer.questionId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  answer.isCorrect 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    Question {index + 1}
                  </h4>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    answer.isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-24">Your Answer:</span>
                    <span className={`text-sm ${
                      answer.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      Option {answer.selectedAnswer + 1}
                    </span>
                  </div>
                  
                  {!answer.isCorrect && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-24">Correct Answer:</span>
                      <span className="text-sm text-green-700">Option {answer.correctAnswer + 1}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center space-y-4"
        >
          <Link href="/quiz">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mr-4">
              Take Quiz Again
            </button>
          </Link>
          
          <Link href="/">
            <button className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors">
              Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 