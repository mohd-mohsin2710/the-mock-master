import connectDB from '../../../../lib/mongodb';
import Otp from '../../../../models/Otp';
import User from '../../../../models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    
    // 🚨 FIX: Yahan await lagana zaroori hai taaki data mil sake
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 });
    }

    // 1. OTP Verification
    const otpRecord = await Otp.findOne({ email: email, code: otp });
    if (!otpRecord) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // 2. Check karo kya user pehle se registered toh nahi hai
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already registered. Please Login.' }, { status: 400 });
    }

    // 3. Account Create karo
    await User.create({
      email: email,
      name: email.split('@')[0], 
    });

    // OTP remove kar do use hone ke baad
    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}