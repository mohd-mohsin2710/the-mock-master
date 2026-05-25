import connectDB from '../../../../lib/mongodb';
import Otp from '../../../../models/Otp';
import { sendOtpEmail } from '../../../../lib/mailer'; // Mailer import kiya
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // 1. Random 6-digit number generator
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Old OTPs delete karo
    await Otp.deleteMany({ email });

    // 3. Save new OTP in DB
    await Otp.create({ email, code: generatedOtp });

    // 4. 🔥 REAL NODEMAILER TRIGGER: Asli email send karo!
    await sendOtpEmail(email, generatedOtp);

    // Clean Production Response: Ab frontend ko code nahi bhejenge security ke liye!
    return NextResponse.json({ 
      success: true, 
      message: 'OTP has been successfully delivered to your inbox!' 
    });
  } catch (error) {
    console.error("Nodemailer error:", error);
    return NextResponse.json({ success: false, error: 'Failed to send email. Check configuration.' }, { status: 500 });
  }
}