'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
}

export default function ProgressBar({ current, total, score }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-gray-700">
          Score: {score}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
} 