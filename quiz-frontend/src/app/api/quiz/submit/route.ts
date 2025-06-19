import { NextRequest, NextResponse } from 'next/server';
import { questions } from '@/lib/questions';
import { QuizSubmission, QuizResult } from '@/types/quiz';

export async function POST(request: NextRequest) {
  try {
    const body: QuizSubmission = await request.json();
    const { answers, timeSpent } = body;

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const resultAnswers: QuizResult['answers'] = [];

    // Calculate results
    Object.entries(answers).forEach(([questionIdStr, userAnswer]) => {
      const questionId = parseInt(questionIdStr);
      const question = questions.find(q => q.id === questionId);
      
      if (question) {
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) {
          score++;
          correctAnswers++;
        } else {
          wrongAnswers++;
        }

        resultAnswers.push({
          questionId,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          question: question.question,
          selectedOption: question.options[userAnswer],
          correctOption: question.options[question.correctAnswer]
        });
      }
    });

    const totalQuestions = Object.keys(answers).length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const result: QuizResult = {
      score,
      totalQuestions,
      percentage,
      correctAnswers,
      wrongAnswers,
      timeSpent,
      answers: resultAnswers
    };

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process quiz submission' },
      { status: 500 }
    );
  }
} 