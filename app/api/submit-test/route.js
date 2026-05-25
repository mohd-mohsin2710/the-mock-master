import connectDB from '../../../lib/mongodb';
import Question from '../../../models/Question';
import Result from '../../../models/Result'; // Naya model import kiya
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { responses } = await request.json();
    const allQuestions = await Question.find({});

    let correct = 0, wrong = 0, attempted = 0;
    
    allQuestions.forEach((q) => {
      const userResponse = responses[q.id];
      if (userResponse && userResponse.selectedOption) {
        attempted++;
        if (userResponse.selectedOption === q.question_correct || userResponse.selectedOption === q.correct) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const finalScore = (correct * 2) - (wrong * 0.5);

    // DATABASE MEIN SAVE KARO
    const newResult = await Result.create({
      score: finalScore,
      correct,
      wrong,
      attempted,
      totalQuestions: allQuestions.length,
    });

    // Wapas Result ki ID bhejo taaki frontend us page par ja sake
    return NextResponse.json({ success: true, resultId: newResult._id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}