"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Logo from '../../components/Logo';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleEmailStep = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      const toastId = toast.info("Dispatched verification code...", { autoClose: false });
      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        toast.dismiss(toastId);
        if (data.success) {
          setOtpSent(true); 
          toast.success("Verification code sent to your email!");
        } else {
          toast.error(data.error || "Failed to send OTP");
        }
      } catch (err) {
        toast.dismiss(toastId);
        toast.error("Server error, please try again.");
      }
    } else {
      const toastId = toast.info("Verifying security token...", { autoClose: false });
      try {
        const result = await signIn('credentials', {
          redirect: false, 
          email: email,
          otp: otp,
        });
        toast.dismiss(toastId);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Access Granted! Redirecting...");
          window.location.href = '/dashboard';
        }
      } catch (err) {
        toast.dismiss(toastId);
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Pane: LOGIN SPECIFIC */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] p-12 flex-col justify-center items-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col items-center text-center max-w-md">
          <Logo className="w-32 h-32 mb-6 border-4 border-slate-800 rounded-full bg-slate-900 shadow-xl" />
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Resume Your Prep,<br /> <span className="text-blue-500">Master the Exam.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12">
            Log in to continue your pending mock series, check evaluate ranks, and track current performance accuracy.
          </p>
        </div>
        <div className="absolute bottom-6 text-slate-500 text-sm italic">
          &copy; 2026 TheMockMaster — Excellence in Exam Simulation.
        </div>
      </div>

      {/* Right Pane: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="lg:hidden mb-8 flex justify-center"><Logo className="w-24 h-24" /></div>
          
          <div className="mb-8">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Existing Student</span>
            <h1 className="text-3xl font-bold text-slate-800 mt-3 mb-2">Sign In</h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Enter your registered credentials to jump straight back into your control panel dashboard.
            </p>
          </div>

          <div className="space-y-6">
            <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border border-slate-200 py-3.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm text-sm">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or with Email</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleEmailStep} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Registered Email Address</label>
                <input type="email" required placeholder="name@example.com" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all text-slate-800 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Enter 6-Digit Login OTP</label>
                  <input type="text" maxLength={6} required placeholder="0 0 0 0 0 0" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-black tracking-[1em] text-center text-slate-800 transition-all text-sm" value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 mt-2 text-sm uppercase tracking-wider">
                {otpSent ? 'Verify & Enter Dashboard' : 'Send One-Time Password'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-500 font-medium">New to TheMockMaster? <a href="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-all">Create an account</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}