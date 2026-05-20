import connectDB from '../../../lib/mongodb';
import Question from '../../../models/Question';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    // Database se saare questions nikaalo
    const allQuestions = await Question.find({});

    // Frontend ke format ke hisab se data ko group karo
    const structuredData = {
      sections: ['Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English'],
      questions: {
        'Reasoning': allQuestions.filter(q => q.section === 'Reasoning'),
        'General Awareness': allQuestions.filter(q => q.section === 'General Awareness'),
        'Quantitative Aptitude': allQuestions.filter(q => q.section === 'Quantitative Aptitude'),
        'English': allQuestions.filter(q => q.section === 'English')
      }
    };

    return NextResponse.json({ success: true, data: structuredData });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}