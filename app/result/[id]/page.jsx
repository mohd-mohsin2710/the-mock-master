"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ResultPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      // Hum ek choti API banayenge result nikalne ke liye
      const res = await fetch(`/api/get-result?id=${id}`);
      const json = await res.json();
      if (json.success) setData(json.data);
      setLoading(false);
    }
    fetchResult();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Fetching your performance... 📊</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#1e293b] p-8 text-center text-white">
          <h1 className="text-3xl font-black tracking-tight mb-2">SCORECARD</h1>
          <p className="text-slate-400 text-sm uppercase font-bold tracking-widest">SSC CGL Mock Test Series</p>
        </div>

        {/* Main Score Section */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-around items-center gap-8 mb-10">
            <div className="text-center">
              <p className="text-5xl font-black text-blue-600">{data.score}</p>
              <p className="text-slate-500 font-bold text-xs uppercase mt-2">Final Score</p>
            </div>
            <div className="h-20 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{data.correct}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{data.wrong}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase">Wrong</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-slate-500 text-xs font-bold mb-1">Accuracy</p>
                <p className="text-xl font-bold text-slate-800">
                    {data.attempted > 0 ? ((data.correct / data.attempted) * 100).toFixed(1) : 0}%
                </p>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-slate-500 text-xs font-bold mb-1">Attempted</p>
                <p className="text-xl font-bold text-slate-800">{data.attempted} / {data.totalQuestions}</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-slate-500 text-xs font-bold mb-1">Test Status</p>
                <p className="text-xl font-bold text-blue-600">Completed</p>
             </div>
          </div>

          <button 
            onClick={() => window.location.href = '/'}
            className="w-full mt-10 bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition-all shadow-lg"
          >
            Back to Home / Retake Test
          </button>
        </div>
      </div>
    </div>
  );
}