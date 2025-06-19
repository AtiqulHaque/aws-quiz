import { NextRequest, NextResponse } from 'next/server';
import { questions, getRandomQuestions } from '@/lib/questions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const random = searchParams.get('random');
  const count = searchParams.get('count');

  try {
    if (random === 'true') {
      const questionCount = count ? parseInt(count) : 10;
      const randomQuestions = getRandomQuestions(questionCount);
      return NextResponse.json({
        success: true,
        data: randomQuestions,
        total: randomQuestions.length
      });
    }

    return NextResponse.json({
      success: true,
      data: questions,
      total: questions.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
} 