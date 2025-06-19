'use client';

import { motion } from 'framer-motion';
import { Question } from '../../lib/api';

interface QuizCardProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  isAnswered: boolean;
  showCorrectAnswer: boolean;
}

export default function QuizCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  isAnswered,
  showCorrectAnswer
}: QuizCardProps) {
  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400';
    }

    if (index === question.correctAnswer) {
      return 'bg-green-500 text-white border-green-500';
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'bg-red-500 text-white border-red-500';
    }

    return 'bg-gray-100 text-gray-500 border-gray-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {question.question}
        </h2>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !isAnswered && onAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${getOptionStyle(index)}`}
            >
              <span className="font-medium">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {showCorrectAnswer && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <h3 className="font-semibold text-blue-800 mb-2">Explanation:</h3>
          <p className="text-blue-700">{question.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
} 