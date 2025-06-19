'use client';

import { motion } from 'framer-motion';
import { QuizResult } from '../../lib/api';

interface ResultsChartProps {
  result: QuizResult;
}

export default function ResultsChart({ result }: ResultsChartProps) {
  const { score, totalQuestions, percentage, correctAnswers, wrongAnswers, timeSpent } = result;

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Results</h2>
        
        <div className="flex justify-center items-center mb-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-blue-500"
                initial={{ strokeDasharray: "0 352" }}
                animate={{ strokeDasharray: `${(percentage / 100) * 352} 352` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getGradeColor(percentage)}`}>
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600">Grade {getGrade(percentage)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
          <div className="text-sm text-green-700">Correct</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
          <div className="text-sm text-red-700">Incorrect</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Total Questions:</span>
          <span className="text-gray-900">{totalQuestions}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Score:</span>
          <span className="text-gray-900">{score}/{totalQuestions}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Time Spent:</span>
          <span className="text-gray-900">{Math.round(timeSpent / 1000)}s</span>
        </div>
      </div>
    </motion.div>
  );
} 