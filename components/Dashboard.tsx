import React from 'react';
import { AnalysisResult, SentimentDataPoint, KeywordData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, AlertTriangle, ThumbsUp, MessageSquare, BrainCircuit } from 'lucide-react';

interface DashboardProps {
  data: AnalysisResult;
}

const SentimentChart: React.FC<{ data: SentimentDataPoint[] }> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            fontSize={12} 
            tickMargin={10} 
            tickFormatter={(value) => value.slice(5)} // Show MM-DD
          />
          <YAxis 
            domain={[-1, 1]} 
            stroke="#64748b" 
            fontSize={12}
            tickFormatter={(val) => val === 0 ? 'Neut' : val === 1 ? 'Pos' : 'Neg'}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [value.toFixed(2), 'Sentiment Score']}
          />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="sentiment" 
            stroke="#4f46e5" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const WordCloud: React.FC<{ words: KeywordData[] }> = ({ words }) => {
  // Sort by absolute value/impact
  const sortedWords = [...words].sort((a, b) => b.value - a.value).slice(0, 30);
  const maxVal = Math.max(...sortedWords.map(w => w.value));
  const minVal = Math.min(...sortedWords.map(w => w.value));

  const getSize = (val: number) => {
    // Linear scale between 0.8rem and 2rem
    const normalized = (val - minVal) / (maxVal - minVal || 1);
    return 0.8 + normalized * 1.5;
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center h-full content-center p-4">
      {sortedWords.map((word, idx) => (
        <span
          key={idx}
          className={`
            px-3 py-1 rounded-full font-medium transition-all hover:scale-110 cursor-default
            ${word.type === 'complaint' ? 'text-red-600 bg-red-50 border border-red-100' : ''}
            ${word.type === 'praise' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : ''}
            ${word.type === 'neutral' ? 'text-slate-600 bg-slate-50 border border-slate-100' : ''}
          `}
          style={{ fontSize: `${getSize(word.value)}rem`, opacity: 0.9 }}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const averageSentiment = data.sentimentTrend.reduce((acc, curr) => acc + curr.sentiment, 0) / (data.sentimentTrend.length || 1);
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Average Sentiment</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-bold ${averageSentiment > 0.2 ? 'text-emerald-600' : averageSentiment < -0.2 ? 'text-red-600' : 'text-slate-700'}`}>
              {averageSentiment.toFixed(2)}
            </span>
            <span className="text-sm text-slate-500 mb-1">/ 1.0</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Based on {data.sentimentTrend.length} data points</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Top Complaint</h3>
          </div>
           <p className="text-lg font-medium text-slate-800 line-clamp-2">
            {data.keywords.find(k => k.type === 'complaint')?.text || "No major complaints"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Top Praise</h3>
          </div>
          <p className="text-lg font-medium text-slate-800 line-clamp-2">
            {data.keywords.find(k => k.type === 'praise')?.text || "No major praises"}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 lg:col-span-2">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            Sentiment Trend
            <span className="text-xs font-normal text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">Last 30 days inferred</span>
          </h3>
          <SentimentChart data={data.sentimentTrend} />
        </div>

        {/* Word Cloud */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[300px] flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Key Themes</h3>
          <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                 <WordCloud words={data.keywords} />
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-xl shadow-lg text-white flex flex-col">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            AI Executive Summary
          </h3>
          <div className="prose prose-invert prose-sm max-w-none mb-6">
            <p className="leading-relaxed text-slate-200">{data.summary.overview}</p>
          </div>
          
          <div className="mt-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">Top 3 Actionable Areas</h4>
            <ul className="space-y-3">
              {data.summary.actionableAreas.map((area, idx) => (
                <li key={idx} className="flex gap-3 items-start bg-white/10 p-3 rounded-lg border border-white/5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold border border-purple-500/30">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-slate-200">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;