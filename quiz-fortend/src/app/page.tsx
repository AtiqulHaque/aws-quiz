'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AWS RDS & Aurora Quiz
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge of Amazon RDS and Aurora with our comprehensive quiz. 
            Perfect for AWS certification preparation and learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">20 Questions</h3>
            <p className="text-gray-600">Comprehensive coverage of RDS and Aurora concepts</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Detailed Explanations</h3>
            <p className="text-gray-600">Learn from explanations for each question</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
            <p className="text-gray-600">Get detailed results and performance analytics</p>
          </motion.div>
        </div>

        <div className="space-y-4">
          <Link href="/quiz">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Quiz
            </motion.button>
          </Link>
          
          <div className="text-sm text-gray-500">
            Ready to test your AWS knowledge?
          </div>
        </div>
      </motion.div>
    </div>
  );
}
