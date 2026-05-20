import connectDB from '../../../lib/mongodb';
import Question from '../../../models/Question';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    
    // Frontend se responses (jo user ne tick kiye hain) milenge body mein
    const { responses } = await request.json();

    // Database se saare questions uthao taaki sahi answer ('correct' field) check kar sakein
    const allQuestions = await Question.find({});

    let totalQuestions = allQuestions.length;
    let attempted = 0;
    let correct = 0;
    let wrong = 0;

    // Har ek question ko check karo
    allQuestions.forEach((q) => {
      const userResponse = responses[q.id];

      // Agar user ne is question ka koi option select kiya tha
      if (userResponse && userResponse.selectedOption) {
        attempted++;
        if (userResponse.selectedOption === q.correct) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    // SSC CGL Marking Scheme: Correct = +2, Wrong = -0.5
    const finalScore = (correct * 2) - (wrong * 0.5);

    // Scorecard tayyar karo
    const scorecard = {
      totalQuestions,
      attempted,
      unattempted: totalQuestions - attempted,
      correct,
      wrong,
      score: finalScore,
    };

    return NextResponse.json({ success: true, data: scorecard });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}