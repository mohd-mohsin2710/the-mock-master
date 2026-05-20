import connectDB from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Database connection function ko call kiya
    await connectDB();
    return NextResponse.json({ success: true, message: "Database connected successfully." });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}