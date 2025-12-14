import React, { useState } from 'react';
import { LayoutDashboard, BarChart3, Info } from 'lucide-react';
import InputSection from './components/InputSection';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import { AnalysisResult } from './types';
import { analyzeReviews } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>('');

  const handleAnalyze = async (text: string, useThinking: boolean) => {
    setIsAnalyzing(true);
    setError(null);
    setRawText(text); // Store raw text for chatbot context
    try {
      const result = await analyzeReviews(text, useThinking);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5" />
             </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Sentilens
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
             <span className="hidden md:inline-flex items-center gap-1.5">
               <Info className="w-4 h-4" />
               Powered by Gemini 2.5 & 3 Pro
             </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
             Transform Customer Feedback into <span className="text-indigo-600">Actionable Growth</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Paste your raw reviews, chat logs, or survey responses. We'll build a visual report and identify key areas for improvement in seconds.
          </p>
        </div>

        {!data ? (
          <div className="animate-in fade-in duration-500">
            <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            {error && (
              <div className="mt-6 max-w-4xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center justify-center gap-2">
                <Info className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        ) : (
           <>
              <div className="mb-6 flex justify-between items-center">
                 <button 
                   onClick={() => setData(null)}
                   className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                 >
                   &larr; Analyze New Data
                 </button>
                 <span className="text-xs text-slate-400">Report generated via Gemini 2.5 Flash / 3 Pro</span>
              </div>
              <Dashboard data={data} />
              {/* Only show chatbot if we have context data */}
              <ChatBot contextText={rawText} />
           </>
        )}
      </main>
    </div>
  );
};

export default App;
