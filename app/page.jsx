'use client';

import { useState, useEffect } from 'react';

// ==================== DUMMY TEST DATA ====================
const dummyTestStructure = {
  sections: ['Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English'],
  questions: {
    'Reasoning': [
      { id: 'r1', text: 'If A = 1, BAN = 17, then what is the value of INDIA?', options: ['36', '37', '38', '39'], correct: '37' },
      { id: 'r2', text: 'Find the odd one out: Tomato, Potato, Carrot, Ginger', options: ['Tomato', 'Potato', 'Carrot', 'Ginger'], correct: 'Tomato' }
    ],
    'General Awareness': [
      { id: 'g1', text: 'Who is known as the Father of Indian Constitution?', options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Subhas Chandra Bose'], correct: 'Dr. B.R. Ambedkar' }
    ],
    'Quantitative Aptitude': [
      { id: 'q1', text: 'A shopkeeper sells a product at a profit of 20%. If he had bought it at 10% less and sold it for 180 more, he would have gained 40%. Find the cost price.', options: ['4500', '5000', '6000', '5500'], correct: '5000' },
      { id: 'q2', text: 'The average of 5 consecutive numbers is 20. The highest number is:', options: ['22', '24', '20', '26'], correct: '22' }
    ],
    'English': [
      { id: 'e1', text: 'Select the synonym of "ABANDON":', options: ['Keep', 'Forsake', 'Cherish', 'Adopt'], correct: 'Forsake' }
    ]
  }
};

export default function Home() {
  // ==================== STATES MANAGEMENT ====================
  const [currentSection, setCurrentSection] = useState('Reasoning');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [tempSelectedOption, setTempSelectedOption] = useState(null); 
  
  const [responses, setResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 Hour default
  const [isHydrated, setIsHydrated] = useState(false); // Hydration Guard

  const activeQuestions = dummyTestStructure.questions[currentSection] || [];
  const currentQuestion = activeQuestions[currentQuestionIdx];

  // ==================== EFFECTS (LOCAL STORAGE & PORTAL LOGIC) ====================
  
  // 1. Initial Load: Local Storage se data nikalna (Hydration Safe)
  useEffect(() => {
    const savedResponses = localStorage.getItem('mock_responses');
    const savedTimer = localStorage.getItem('mock_timer');

    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
    if (savedTimer) {
      setTimeLeft(parseInt(savedTimer, 10));
    }
    setIsHydrated(true);
  }, []);

  // 2. Continuous Autosave: Responses save karna
  useEffect(() => {
    if (isHydrated && Object.keys(responses).length > 0) {
      localStorage.setItem('mock_responses', JSON.stringify(responses));
    }
  }, [responses, isHydrated]);

  // 3. Continuous Autosave: Timer save karna
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('mock_timer', timeLeft.toString());
    }
  }, [timeLeft, isHydrated]);

  // 4. Real-time Countdown Ticker
  useEffect(() => {
    if (!isHydrated || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isHydrated]);

  // ==================== NAVIGATION & BUTTON LOGICS ====================
  
      const moveToNextQuestion = () => {
      const allSections = dummyTestStructure.sections;
      const currentSectionIdx = allSections.indexOf(currentSection);

      // 1. Agar current section mein aage questions bache hain
      if (currentQuestionIdx < activeQuestions.length - 1) {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
      } 
      // 2. Agar current section ka last question hai, toh section badlo
      else {
        // Agar agla section available hai
        if (currentSectionIdx < allSections.length - 1) {
          const nextSection = allSections[currentSectionIdx + 1];
          setCurrentSection(nextSection);
          setCurrentQuestionIdx(0); // Agle section ke pehle question par
        } 
        // 3. Agar aakhri section ka bhi aakhri question hai, toh wapas pehle section par loop karo
        else {
          setCurrentSection(allSections[0]); // Pehla section (Reasoning)
          setCurrentQuestionIdx(0); // Uska pehla question
        }
      }
      setTempSelectedOption(null); // Temp selection clear karo agle question ke liye
    };

  const handleSaveNext = () => {
    if (!currentQuestion) return;
    
    const savedForThisQ = responses[currentQuestion.id]?.selectedOption;
    const finalSelection = tempSelectedOption || savedForThisQ || null;
    const status = finalSelection ? 'answered' : 'not_answered';

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: { selectedOption: finalSelection, status: status }
    }));

    moveToNextQuestion();
  };

  const handleMarkReview = () => {
    if (!currentQuestion) return;

    const savedForThisQ = responses[currentQuestion.id]?.selectedOption;
    const finalSelection = tempSelectedOption || savedForThisQ || null;

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: { selectedOption: finalSelection, status: 'review' }
    }));

    moveToNextQuestion();
  };

  const handleClear = () => {
    if (!currentQuestion) return;

    setTempSelectedOption(null);
    setResponses(prev => {
      const updated = { ...prev };
      delete updated[currentQuestion.id]; 
      return updated;
    });
  };

  // Time Converter Helper
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-[#f1f5f9] flex flex-col select-none font-sans text-gray-800">
      
      {/* ==================== 1. TOP HEADER ==================== */}
      <header className="bg-[#1e293b] text-white h-14 px-4 flex justify-between items-center shadow-md border-b border-[#334155]">
        <div className="flex items-center gap-3">
          <span className="bg-[#3b82f6] text-xs font-bold px-2 py-1 rounded-sm uppercase">Exam Portal</span>
          <h1 className="font-bold text-sm md:text-base tracking-wide text-slate-200">TheMockMaster — SSC CGL</h1>
        </div>
        
        {/* Right Side: Timer & User Profile */}
        <div className="flex items-center gap-4">
          <div className="bg-[#0f172a] px-3 py-1.5 rounded-md border border-[#334155] text-amber-400 font-mono font-bold text-sm md:text-base shadow-inner">
            Time Left: <span className="text-white">{isHydrated ? formatTime(timeLeft) : '00:00'}</span>
          </div>
          
          <div className="flex items-center gap-2.5 border-l border-slate-600 pl-4 sm:flex">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Candidate</p>
              <p className="text-xs font-bold text-slate-200">Mohammad Mohsin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              MM
            </div>
          </div>
        </div>
      </header>

      {/* ==================== 2. SECTION TABS BAR ==================== */}
      <div className="bg-[#e2e8f0] border-b border-slate-300 px-4 pt-1 flex gap-1 overflow-x-auto text-xs font-bold">
        {dummyTestStructure.sections.map((section) => (
          <button
            key={section}
            onClick={() => {
              setCurrentSection(section);
              setCurrentQuestionIdx(0);
              setTempSelectedOption(null);
            }}
            className={`px-4 py-2.5 rounded-t-md transition-all ${
              currentSection === section
                ? 'bg-[#ffffff] text-[#1e293b] border-t-2 border-[#1e293b] shadow-sm'
                : 'bg-transparent text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* ==================== 3. MAIN PORTAL (Split View) ==================== */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDE: Question & Options Area */}
        <div className="flex-1 bg-white flex flex-col justify-between overflow-y-auto border-r border-slate-200">
          
          {currentQuestion ? (
            <div className="p-4 md:p-6 flex-1">
              <div className="border-b border-slate-200 pb-3 mb-4 flex justify-between items-center">
                <span className="font-extrabold text-slate-700 text-sm bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
                  Question No. {currentQuestionIdx + 1}
                </span>
                <div className="flex gap-2 text-[11px] font-bold">
                  <span className="text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded">Correct: +2.0</span>
                  <span className="text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Incorrect: -0.5</span>
                </div>
              </div>
              
              <div className="text-slate-800 font-medium mb-6 text-sm md:text-base leading-relaxed">
                {currentQuestion.text}
              </div>

             {/* Options */}
              <div className="space-y-3 max-w-2xl">
                {currentQuestion.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index);
                  // Dynamic State Matching
                  const isChecked = tempSelectedOption === optionLetter || (!tempSelectedOption && responses[currentQuestion.id]?.selectedOption === optionLetter);

                  // Click handler ko simple aur direct banaya
                  const handleOptionToggle = (e) => {
                    e.preventDefault(); // Default bubble aur double-trigger ko rokne ke liye
                    if (isChecked) {
                      handleClear(); 
                    } else {
                      setTempSelectedOption(optionLetter); 
                    }
                  };

                  return (
                    <div 
                      key={index} 
                      onClick={handleOptionToggle} // Ab label ki jagah div use kiya toggle glitch se bachne ke liye
                      className={`flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition-all shadow-sm border-l-4 ${
                        isChecked ? 'bg-blue-50/50 border-blue-500 border-l-blue-600' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={currentQuestion.id}
                        value={optionLetter}
                        checked={isChecked}
                        readOnly // Dynamic state toggle hum upar wale function se handle kar rahe hain
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                      />
                      <span className="text-xs font-bold text-slate-400 font-mono">{optionLetter}.</span>
                      <span className="text-sm text-slate-700 font-medium">{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Bottom Action Buttons Panel */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap gap-2 justify-between text-xs font-bold">
            <div className="flex gap-2">
              <button onClick={handleMarkReview} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded shadow transition-all active:scale-95">
                Mark for Review & Next
              </button>
              <button onClick={handleClear} className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded shadow-sm transition-all active:scale-95">
                Clear Response
              </button>
            </div>
            <button onClick={handleSaveNext} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded shadow transition-all active:scale-95 tracking-wide">
              Save & Next
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Question Palette Sidebar */}
        <div className="w-full md:w-80 bg-slate-50 p-4 flex flex-col justify-between border-t md:border-t-0 border-slate-200 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-1">
              Question Palette
            </h3>
            <div className="grid grid-cols-5 gap-2.5 p-1 max-h-70 overflow-y-auto">
              {activeQuestions.map((q, i) => {
                const qStatus = responses[q.id]?.status;
                let btnClass = 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'; 

                if (qStatus === 'answered') btnClass = 'bg-green-600 text-white border-green-700';
                if (qStatus === 'not_answered') btnClass = 'bg-red-500 text-white border-red-600';
                if (qStatus === 'review') btnClass = 'bg-amber-500 text-white border-amber-600';

                if (currentQuestionIdx === i) btnClass += ' ring-2 ring-blue-500 font-black scale-105';

                return (
                  <button 
                    key={i} 
                    onClick={() => {
                      setCurrentQuestionIdx(i);
                      setTempSelectedOption(null);
                    }}
                    className={`h-9 w-9 rounded-md text-xs font-bold flex items-center justify-center border shadow-sm transition-all ${btnClass}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Legends */}
          <div className="border-t border-slate-200 pt-4 mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-[11px] text-slate-600 font-bold bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 bg-green-600 rounded-sm shadow-sm"></span> Answered</div>
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 bg-red-500 rounded-sm shadow-sm"></span> Not Answered</div>
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 bg-amber-500 rounded-sm shadow-sm"></span> For Review</div>
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 bg-white border border-slate-300 rounded-sm shadow-sm"></span> Not Visited</div>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-lg text-xs shadow-md tracking-wider transition-all uppercase">
              Submit Test
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}