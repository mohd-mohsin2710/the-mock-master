"use client";
import { useState } from 'react';
import Logo from '../../components/Logo';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleRegisterStep = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      const toastId = toast.info("Generating profile credentials...", { autoClose: false });
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
          toast.success("Registration OTP dispatched successfully!");
        } else {
          toast.error(data.error);
        }
      } catch (err) {
        toast.dismiss(toastId);
        toast.error("Server error, try again.");
      }
    } else {
      const toastId = toast.info("Creating secure account...", { autoClose: false });
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        toast.dismiss(toastId);
        if (data.success) {
          toast.success("Registration completed! Please Sign In.");
          window.location.href = '/login';
        } else {
          toast.error(data.error);
        }
      } catch (err) {
        toast.dismiss(toastId);
        toast.error("Registration failed.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Pane: REGISTER SPECIFIC (Color Balanced to Primary Blue) */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] p-12 flex-col justify-center items-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col items-center text-center max-w-md">
          <Logo className="w-32 h-32 mb-6 border-4 border-slate-800 rounded-full bg-slate-900 shadow-xl" />
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Start Free,<br /> <span className="text-blue-500">Master your Future.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12">
            Create your unique master account today to unlock live evaluation test series, ranks, and multi-subject analytics.
          </p>
        </div>
        <div className="absolute bottom-6 text-slate-500 text-sm italic">
          &copy; 2026 TheMockMaster — Excellence in Exam Simulation.
        </div>
      </div>

      {/* Right Pane: REGISTER FORM (Theme Consistent) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="lg:hidden mb-8 flex justify-center"><Logo className="w-24 h-24" /></div>
          
          <div className="mb-8">
            {/* Blue distinctive layout badge */}
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">New Registration</span>
            <h1 className="text-3xl font-bold text-slate-800 mt-3 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Enter your active email to initialize your exam profile parameters and database record entry.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative flex items-center py-2">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Register with Email</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleRegisterStep} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Fresh Email Address</label>
                <input type="email" required placeholder="name@example.com" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all text-slate-800 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Enter 6-Digit Registration OTP</label>
                  <input type="text" maxLength={6} required placeholder="0 0 0 0 0 0" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-black tracking-[1em] text-center text-slate-800 transition-all text-sm" value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>
              )}

              {/* Back to Consistent Royal Blue Button */}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 mt-2 text-sm uppercase tracking-wider">
                {otpSent ? 'Complete Registration' : 'Register with OTP'}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-slate-500 font-medium">Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-all">Sign In</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}