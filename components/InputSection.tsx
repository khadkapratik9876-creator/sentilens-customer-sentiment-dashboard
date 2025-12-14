import React, { useState } from 'react';
import { UploadCloud, FileText, Loader2, BrainCircuit } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (text: string, useThinking: boolean) => void;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [useThinking, setUseThinking] = useState(false);

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze(text, useThinking);
    }
  };

  const loadSampleData = () => {
    const sample = `
2023-10-01: I absolutely love the new interface! It's so clean and intuitive. (Sentiment: Positive)
2023-10-02: The app keeps crashing when I try to upload a photo. Please fix this ASAP. (Sentiment: Negative)
2023-10-03: Customer support was helpful, but the wait time was way too long. 45 minutes on hold! (Sentiment: Neutral)
2023-10-05: Best purchase I've made all year. The battery life is incredible. (Sentiment: Positive)
2023-10-06: I'm disappointed with the shipping speed. It took two weeks to arrive. (Sentiment: Negative)
2023-10-07: Great features, but the subscription price is a bit steep for what you get. (Sentiment: Neutral)
2023-10-08: The latest update broke the login functionality. I can't access my account. (Sentiment: Negative)
2023-10-09: Amazing build quality! Feels very premium in the hand. (Sentiment: Positive)
2023-10-10: Why did you remove the dark mode? My eyes are burning. (Sentiment: Negative)
2023-10-12: The AI suggestions are actually surprisingly good. Saved me a lot of time. (Sentiment: Positive)
    `.trim();
    setText(sample);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Input Reviews
          </h2>
          <p className="text-slate-500 mt-1">Paste your raw customer feedback below to generate insights.</p>
        </div>
        <button 
          onClick={loadSampleData}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
        >
          Load Sample Data
        </button>
      </div>

      <textarea
        className="w-full h-64 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm leading-relaxed text-slate-700 bg-slate-50 transition-all"
        placeholder="Paste reviews here (e.g., CSV content, exported chat logs, or raw comments)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isAnalyzing}
      />

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors w-full md:w-auto">
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={useThinking} 
              onChange={(e) => setUseThinking(e.target.checked)} 
              className="sr-only peer" 
              disabled={isAnalyzing}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <BrainCircuit className="w-4 h-4 text-purple-600" />
              Thinking Mode
            </span>
            <span className="text-xs text-slate-500">Deep reasoning with Gemini 3 Pro (Slower)</span>
          </div>
        </label>

        <button
          onClick={handleAnalyze}
          disabled={!text.trim() || isAnalyzing}
          className={`
            flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-semibold shadow-md transition-all w-full md:w-auto
            ${!text.trim() || isAnalyzing 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              Generate Report
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
