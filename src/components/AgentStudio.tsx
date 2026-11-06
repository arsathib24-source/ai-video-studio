'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, RefreshCw, AlertCircle, Copy, Check, FileText, Code2, Search, Play } from 'lucide-react';

interface AgentStudioProps {
  geminiKey?: string;
  onOpenSettings: () => void;
}

const AGENTS = [
  {
    id: 'content_creator',
    name: 'Content Creator Agent',
    icon: FileText,
    desc: 'ভাইরাল ব্লগ, আর্টিকেল, এসইও ট্যাগ ও সোশ্যাল মিডিয়া প্যাক স্বয়ংক্রিয়ভাবে তৈরি করে।',
  },
  {
    id: 'researcher',
    name: 'Deep Research Agent',
    icon: Search,
    desc: 'যেকোনো বিষয়ের ওপর গভীর তথ্যভিত্তিক এনালাইসিস, যুক্তি ও এক্সিকিউটিভ রিপোর্ট তৈরি করে।',
  },
  {
    id: 'coder',
    name: 'Software Architect Agent',
    icon: Code2,
    desc: 'সিস্টেম ডিজাইন, ডাটাবেস স্কিমা ও সম্পূর্ণ ক্লিন প্রোডাকশন কোড লিখে দেয়।',
  },
];

export const AgentStudio: React.FC<AgentStudioProps> = ({
  geminiKey,
  onOpenSettings,
}) => {
  const [selectedAgent, setSelectedAgent] = useState('content_creator');
  const [objective, setObjective] = useState('');
  const [language, setLanguage] = useState('Bengali');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRunAgent = async () => {
    if (!objective.trim()) {
      setError('অনুগ্রহ করে এজেন্টের জন্য একটি স্পষ্ট লক্ষ্য বা টাস্ক লিখুন।');
      return;
    }
    if (!geminiKey) {
      setError('AI Agent চালানোর জন্য Google Gemini API Key প্রয়োজন। সেটিংস থেকে যুক্ত করুন (ফ্রি)।');
      onOpenSettings();
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: selectedAgent,
          objective: objective.trim(),
          language,
          geminiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to run agent.');
      }

      setOutput(data.output);
    } catch (err: any) {
      setError(err?.message || 'এজেন্ট পরিচালনায় সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Choose Agent & Objective */}
      <div className="lg:col-span-5 space-y-5 bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span>Antigravity AI Agents Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            স্বয়ংক্রিয় এআই এজেন্ট দিয়ে দীর্ঘ ও জটিল কাজগুলো একক ক্লিকে সম্পন্ন করুন।
          </p>
        </div>

        {/* Agent Cards */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">এজেন্ট নির্বাচন করুন (Select Agent)</label>
          <div className="space-y-2">
            {AGENTS.map((ag) => {
              const Icon = ag.icon;
              const isSelected = selectedAgent === ag.id;
              return (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => setSelectedAgent(ag.id)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{ag.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{ag.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Task / Objective Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">এজেন্টের কাজের বিবরণ (Task Objective)</label>
          <textarea
            rows={5}
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="এজেন্টকে ঠিক কী করতে হবে তা বিস্তারিত লিখুন (যেমন: 'Build an e-commerce subscription SaaS with Stripe' অথবা 'Write a viral medium article on Future of Quantum Computing')..."
            className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center justify-between">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="Bengali">ভাষা: বাংলা (Bengali)</option>
            <option value="English">Language: English</option>
          </select>
        </div>

        {error && (
          <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          disabled={loading || !objective.trim()}
          onClick={handleRunAgent}
          className="w-full py-3 px-4 rounded-xl font-medium text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 disabled:opacity-40 flex items-center justify-center space-x-2 transition"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>এজেন্ট কাজ করছে...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>এজেন্ট রান করুন (Run Autonomous Agent)</span>
            </>
          )}
        </button>
      </div>

      {/* Right Column: Execution Output */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>এজেন্ট আউটপুট (Execution Results)</span>
            </h3>
            {output && (
              <button
                onClick={copyOutput}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy All'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px] text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {output ? (
              output
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20 space-y-3">
                <Bot className="w-10 h-10 text-slate-700" />
                <p>টাস্ক লিখে "এজেন্ট রান করুন" চাপলে ফলাফল এখানে দেখতে পাবেন</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
