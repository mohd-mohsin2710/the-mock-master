import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(toEmail, otpCode) {
  const mailOptions = {
    from: `"TheMockMaster" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🔐 Your Security Verification Code: ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #1e3a8a; margin: 0; font-size: 24px;">TheMockMaster</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Secure Examination Portal</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
        <div style="padding: 10px 0;">
          <p style="font-size: 16px; color: #334155;">Hello Aspirant,</p>
          <p style="font-size: 14px; color: #64748b; line-height: 1.5;">Use the following dynamic secure one-time password (OTP) to complete your authentication. This code is strictly valid for <strong>5 minutes</strong>.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #2563eb; background-color: #f1f5f9; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1;">
              ${otpCode}
            </span>
          </div>
          
          <p style="font-size: 12px; color: #94a3b8; font-style: italic; text-align: center;">If you did not request this code, please ignore this email safely.</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
        <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #94a3b8;">
          &copy; 2026 TheMockMaster. All rights reserved.
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}