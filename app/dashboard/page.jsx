"use client";
import { useSession, signOut } from "next-auth/react";
import Logo from "../../components/Logo";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Agar session load ho raha ho
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-bold animate-pulse text-sm">Loading your master profile...</p>
      </div>
    );
  }

  // Security Check: Agar koi bina login kiye direct url daal kar aaye
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <h1 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-500 text-sm mb-4">Please log in to view your examination dashboard.</p>
        <a href="/login" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl text-sm shadow-md">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Centralized Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <h1 className="font-bold text-slate-700 text-sm md:text-base hidden sm:block">
            Student Control Center
          </h1>
        </div>

        {/* User Profile & Sign Out Block */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-800">{session.user?.name}</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-4 py-2 rounded-xl text-xs transition-all active:scale-95"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Grid Content Area */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back, {session.user?.name}!</h2>
          <p className="text-slate-500 text-sm font-medium">Monitor your academic performance and manage mock test series.</p>
        </div>

        {/* Quick Insights Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Mocks Attempted</h3>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Average Accuracy</h3>
            <p className="text-3xl font-bold text-slate-800">0.0%</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Global Rank</h3>
            <p className="text-3xl font-bold text-slate-800">--</p>
          </div>
        </div>
      </main>
    </div>
  );
}