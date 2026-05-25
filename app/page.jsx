"use client";

import { useState, useEffect } from "react";
import Logo from '../components/Logo';

export default function Home() {
  // ==================== STATES MANAGEMENT ====================
  const [currentSection, setCurrentSection] = useState("Reasoning");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [tempSelectedOption, setTempSelectedOption] = useState(null);

  // Database States
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);

  const [responses, setResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isHydrated, setIsHydrated] = useState(false);

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Safely get active questions from state
  const activeQuestions = questions[currentSection] || [];
  const currentQuestion = activeQuestions[currentQuestionIdx];

  // Yeh count karega ki current section mein kitne questions 'answered' ya 'review' status mein hain
  const attemptedInSection = activeQuestions.filter(
    (q) =>
      responses[q.id]?.status === "answered" ||
      responses[q.id]?.status === "review",
  ).length;

  // Handle Submit Test
  const handleSubmitTest = async () => {
    setShowSubmitModal(false);
    try {
      const res = await fetch("/api/submit-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses }),
      });

      const result = await res.json();

      if (result.success) {
        localStorage.removeItem("mock_responses");
        localStorage.removeItem("mock_timer");
        // Naye result page par bhej do
        window.location.href = `/result/${result.resultId}`;
      }
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  // ==================== EFFECTS (DATA FETCHING & PORTAL LOGIC) ====================

  // 1. Initial Database Load
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/get-questions");
        const result = await res.json();

        if (result.success) {
          setSections(result.data.sections);
          setQuestions(result.data.questions);
        }
      } catch (error) {
        console.error("Frontend fetching error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  // 2. Local Storage se Timer aur Response nikalna (Hydration Safe)
  useEffect(() => {
    if (loading) return; // Jab tak data na aaye tab tak ruko
    const savedResponses = localStorage.getItem("mock_responses");
    const savedTimer = localStorage.getItem("mock_timer");

    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
    if (savedTimer) {
      setTimeLeft(parseInt(savedTimer, 10));
    }
    setIsHydrated(true);
  }, [loading]);

  // 3. Continuous Autosave: Responses save karna
  useEffect(() => {
    if (isHydrated && Object.keys(responses).length > 0) {
      localStorage.setItem("mock_responses", JSON.stringify(responses));
    }
  }, [responses, isHydrated]);

  // 4. Continuous Autosave: Timer save karna
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("mock_timer", timeLeft.toString());
    }
  }, [timeLeft, isHydrated]);

  // 5. Real-time Countdown Ticker
  useEffect(() => {
    if (!isHydrated || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isHydrated]);

  // ==================== NAVIGATION & BUTTON LOGICS ====================

  const moveToNextQuestion = () => {
    if (sections.length === 0) return;
    const currentSectionIdx = sections.indexOf(currentSection);

    // 1. Agar current section mein aage questions bache hain
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
    // 2. Agar current section ka last question hai, toh section badlo
    else {
      if (currentSectionIdx < sections.length - 1) {
        const nextSection = sections[currentSectionIdx + 1];
        setCurrentSection(nextSection);
        setCurrentQuestionIdx(0);
      }
      // 3. Loop back to first section
      else {
        setCurrentSection(sections[0]);
        setCurrentQuestionIdx(0);
      }
    }
    setTempSelectedOption(null);
  };

  const handleSaveNext = () => {
    if (!currentQuestion) return;

    const savedForThisQ = responses[currentQuestion.id]?.selectedOption;
    const finalSelection = tempSelectedOption || savedForThisQ || null;
    const status = finalSelection ? "answered" : "not_answered";

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: { selectedOption: finalSelection, status: status },
    }));

    moveToNextQuestion();
  };

  const handleMarkReview = () => {
    if (!currentQuestion) return;

    const savedForThisQ = responses[currentQuestion.id]?.selectedOption;
    const finalSelection = tempSelectedOption || savedForThisQ || null;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOption: finalSelection,
        status: "review",
      },
    }));

    moveToNextQuestion();
  };

  const handleClear = () => {
    if (!currentQuestion) return;

    setTempSelectedOption(null);
    setResponses((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      return updated;
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // 6. Loading screen state handler
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-xl font-bold">
        Loading Questions ⏳
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f5f9] flex flex-col select-none font-sans text-gray-800">
      {/* ==================== 1. TOP HEADER ==================== */}
      <header className="bg-[#1e293b] text-white h-14 px-4 flex justify-between items-center shadow-md border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 brightness-110" />
            <div className="h-6 w-px bg-slate-600 hidden sm:block"></div>
            <h1 className="font-bold text-sm md:text-base tracking-wide text-slate-200">
              SSC CGL Mock Test
            </h1>
          </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#0f172a] px-3 py-1.5 rounded-md border border-[#334155] text-amber-400 font-mono font-bold text-sm md:text-base shadow-inner">
            Time Left:{" "}
            <span className="text-white">
              {isHydrated ? formatTime(timeLeft) : "00:00"}
            </span>
          </div>

          <div className="flex items-center gap-2.5 border-l border-slate-600 pl-4 sm:flex">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Candidate
              </p>
              <p className="text-xs font-bold text-slate-200">
                Mohammad Mohsin
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center text-white font-bold text-sm shadow-sm hover:cursor-pointer">
              MM
            </div>
          </div>
        </div>
      </header>

      {/* ==================== 2. SECTION TABS BAR ==================== */}
      <div className="bg-[#e2e8f0] border-b border-slate-300 px-4 pt-1 flex gap-1 overflow-x-auto text-xs font-bold ">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => {
              setCurrentSection(section);
              setCurrentQuestionIdx(0);
              setTempSelectedOption(null);
            }}
            className={`px-4 py-2.5 rounded-t-md transition-all hover:cursor-pointer ${
              currentSection === section
                ? "bg-[#ffffff] text-[#1e293b] border-t-2 border-[#1e293b] shadow-sm"
                : "bg-transparent text-slate-600 hover:bg-slate-200/60"
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
                  <span className="text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                    Correct: +2.0
                  </span>
                  <span className="text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Incorrect: -0.5
                  </span>
                </div>
              </div>

              <div className="text-slate-800 font-medium mb-6 text-sm md:text-base leading-relaxed">
                {currentQuestion.question}
              </div>

              {/* Options */}
              <div className="space-y-3 max-w-2xl">
                {currentQuestion.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index);

                  // Ab hum pure 'option' text ko check karenge letter ki jagah
                  const isChecked =
                    tempSelectedOption === option ||
                    (!tempSelectedOption &&
                      responses[currentQuestion.id]?.selectedOption === option);

                  const handleOptionToggle = (e) => {
                    e.preventDefault();
                    if (isChecked) {
                      handleClear();
                    } else {
                      setTempSelectedOption(option); // State mein pura text save hoga
                    }
                  };

                  return (
                    <div
                      key={index}
                      onClick={handleOptionToggle}
                      className={`flex items-center gap-3 p-3.5 border rounded-lg hover:cursor-pointer transition-all shadow-sm border-l-4 ${
                        isChecked
                          ? "bg-blue-50/50 border-blue-500 border-l-blue-600"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={option} // Value bhi ab pura text jayegi
                        checked={isChecked}
                        readOnly
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 hover:cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        {optionLetter}.
                      </span>
                      <span className="text-sm text-slate-700 font-medium">
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 text-slate-500">
              No questions found in this section.
            </div>
          )}

          {/* Bottom Action Buttons Panel */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap gap-2 justify-between text-xs font-bold">
            <div className="flex gap-2">
              <button
                onClick={handleMarkReview}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded shadow transition-all active:scale-95 hover:cursor-pointer"
              >
                Mark for Review & Next
              </button>
              <button
                onClick={handleClear}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded shadow-sm transition-all active:scale-95 hover:cursor-pointer"
              >
                Clear Response
              </button>
            </div>
            <button
              onClick={handleSaveNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded shadow transition-all active:scale-95 tracking-wide hover:cursor-pointer"
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Question Palette Sidebar */}
        <div className="w-full md:w-80 bg-slate-50 p-4 flex flex-col justify-between border-t md:border-t-0 border-slate-200 overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Question Palette
              </h3>
              {/* Naya Counter Yahan Hai */}
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Attempted: {attemptedInSection} / {activeQuestions.length}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2.5 p-1 max-h-70 overflow-y-auto">
              {activeQuestions.map((q, i) => {
                const qStatus = responses[q.id]?.status;
                let btnClass =
                  "bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:cursor-pointer";

                if (qStatus === "answered")
                  btnClass = "bg-green-600 text-white border-green-700";
                if (qStatus === "not_answered")
                  btnClass = "bg-red-500 text-white border-red-600";
                if (qStatus === "review")
                  btnClass = "bg-amber-500 text-white border-amber-600";

                if (currentQuestionIdx === i)
                  btnClass += " ring-2 ring-blue-500 font-black scale-105";

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
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-green-600 rounded-sm shadow-sm"></span>{" "}
                Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-red-500 rounded-sm shadow-sm"></span>{" "}
                Not Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-amber-500 rounded-sm shadow-sm"></span>{" "}
                For Review
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-white border border-slate-300 rounded-sm shadow-sm"></span>{" "}
                Not Visited
              </div>
            </div>
            <button 
              onClick={() => setShowSubmitModal(true)} // Alert ki jagah Modal khulega
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-lg text-xs shadow-md tracking-wider transition-all uppercase active:scale-95 hover:cursor-pointer"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* ==================== CUSTOM SUBMIT MODAL ==================== */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop (Piche ka andhera) - Is par click karne se bhi modal band ho jayega */}
            <div 
              onClick={() => setShowSubmitModal(false)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></div>
            
            {/* Modal Box */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
              
             {/* ❌ TOP-RIGHT CLOSE ICON */}
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="absolute top-3 right-4 text-black hover:text-red-600 transition-all text-2xl font-bold leading-none select-none p-1 hover:hover:cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  aria-label="Close modal"
                >
                  &times;
                </button>

              <div className="text-center mt-2">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Final Submission?</h3>
                <p className="text-slate-500 text-sm mb-6">
                  You have attempted <span className="font-bold text-slate-800">{Object.keys(responses).length}</span> questions. Do you want to end the test and see your results?
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all hover:hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmitTest}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all hover:cursor-pointer"
                  >
                    Yes, Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}
