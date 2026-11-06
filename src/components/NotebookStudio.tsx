'use client';

import React, { useState } from 'react';
import { BookOpen, Headphones, Send, Sparkles, RefreshCw, AlertCircle, FileText, Play, Pause, Volume2, User } from 'lucide-react';

interface NotebookStudioProps {
  geminiKey?: string;
  onOpenSettings: () => void;
}

export const NotebookStudio: React.FC<NotebookStudioProps> = ({
  geminiKey,
  onOpenSettings,
}) => {
  const [documentContent, setDocumentContent] = useState('');
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('Bengali');
  const [loading, setLoading] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ q: string; a: string }[]>([]);
  const [podcastData, setPodcastData] = useState<{ podcastTitle: string; turns: any[] } | null>(null);
  const [error, setError] = useState('');

  // Audio playback state
  const [activeAudioTurn, setActiveAudioTurn] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleAskQuestion = async () => {
    if (!documentContent.trim()) {
      setError('অনুগ্রহ করে আগে কোনো ডকুমেন্ট বা নোটের টেক্সট দিন।');
      return;
    }
    if (!question.trim()) {
      setError('অনুগ্রহ করে ডকুমেন্ট সম্পর্কে একটি প্রশ্ন লিখুন।');
      return;
    }
    if (!geminiKey) {
      setError('NotebookLM ফিচারের জন্য Google Gemini API Key প্রয়োজন। সেটিংস থেকে যুক্ত করুন (ফ্রি)।');
      onOpenSettings();
      return;
    }

    const q = question.trim();
    setQuestion('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/notebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          documentContent,
          question: q,
          language,
          geminiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to query document.');
      }

      setChatHistory((prev) => [...prev, { q, a: data.answer }]);
    } catch (err: any) {
      setError(err?.message || 'ডকুমেন্ট এনালাইসিস করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePodcast = async () => {
    if (!documentContent.trim()) {
      setError('অনুগ্রহ করে আগে কোনো ডকুমেন্ট বা নোটের টেক্সট দিন।');
      return;
    }
    if (!geminiKey) {
      setError('Google Gemini API Key প্রয়োজন। সেটিংস থেকে যুক্ত করুন (ফ্রি)।');
      onOpenSettings();
      return;
    }

    setError('');
    setGeneratingAudio(true);

    try {
      const res = await fetch('/api/notebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'audio_overview',
          documentContent,
          language,
          geminiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate audio overview.');
      }

      setPodcastData({
        podcastTitle: data.podcastTitle,
        turns: data.turns,
      });
    } catch (err: any) {
      setError(err?.message || 'পডকাস্ট অডিও ওভারভিউ তৈরি ব্যর্থ হয়েছে।');
    } finally {
      setGeneratingAudio(false);
    }
  };

  const playTurnAudio = (url: string, index: number) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    if (activeAudioTurn === index) {
      setActiveAudioTurn(null);
      setCurrentAudio(null);
      return;
    }

    const audio = new Audio(url);
    setCurrentAudio(audio);
    setActiveAudioTurn(index);
    audio.play();

    audio.onended = () => {
      // Auto play next turn if exists
      if (podcastData && index + 1 < podcastData.turns.length) {
        playTurnAudio(podcastData.turns[index + 1].audioUrl, index + 1);
      } else {
        setActiveAudioTurn(null);
        setCurrentAudio(null);
      }
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Source Document Input */}
      <div className="lg:col-span-5 space-y-4 bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">NotebookLM Source</h2>
          </div>
          <span className="text-[10px] text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
            Google AI Clone
          </span>
        </div>

        <p className="text-xs text-slate-400">
          আপনার যেকোনো রিসার্চ পেপার, বইয়ের অধ্যায়, মিটিং নোট বা যেকোনো টেক্সট এখানে পেস্ট করুন:
        </p>

        <textarea
          rows={10}
          value={documentContent}
          onChange={(e) => setDocumentContent(e.target.value)}
          placeholder="এখানে আপনার ডকুমেন্ট বা আর্টিকেলের টেক্সট পেস্ট করুন..."
          className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition"
        />

        <div className="flex items-center justify-between pt-1">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="Bengali">ভাষা: বাংলা (Bengali)</option>
            <option value="English">Language: English</option>
          </select>

          {/* Audio Overview Button */}
          <button
            type="button"
            disabled={generatingAudio || !documentContent.trim()}
            onClick={handleGeneratePodcast}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow disabled:opacity-40 transition"
          >
            {generatingAudio ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>পডকাস্ট তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <Headphones className="w-3.5 h-3.5 text-pink-200" />
                <span>Audio Podcast Overview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Q&A Chat & Audio Podcast Overview */}
      <div className="lg:col-span-7 space-y-6">
        {/* Audio Overview Player (NotebookLM Feature) */}
        {podcastData && (
          <div className="bg-[#0e1626]/90 border border-pink-500/30 rounded-2xl p-5 backdrop-blur-sm shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">NotebookLM 2-Host Audio Discussion</span>
                  <h3 className="text-sm font-bold text-white">{podcastData.podcastTitle}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => playTurnAudio(podcastData.turns[0].audioUrl, 0)}
                className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center gap-1 shadow"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Play All</span>
              </button>
            </div>

            {/* Podcast Turns */}
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {podcastData.turns.map((turn: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 transition ${
                    activeAudioTurn === idx
                      ? 'bg-pink-950/40 border-pink-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-bold block mb-0.5 ${turn.speaker === 'Host 1' ? 'text-indigo-400' : 'text-pink-400'}`}>
                      {turn.speaker} ({turn.speaker === 'Host 1' ? 'Male' : 'Female'})
                    </span>
                    <p>{turn.text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => playTurnAudio(turn.audioUrl, idx)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0 mt-0.5"
                  >
                    {activeAudioTurn === idx ? <Pause className="w-3.5 h-3.5 text-pink-400" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Q&A Section */}
        <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>ডকুমেন্ট নিয়ে প্রশ্ন-উত্তর (Document Q&A)</span>
          </h3>

          {/* Q&A List */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                ডকুমেন্ট পেস্ট করে নিচের বক্সে যেকোনো প্রশ্ন জিজ্ঞাসা করুন
              </div>
            ) : (
              chatHistory.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-white font-medium flex items-start gap-2">
                    <User className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{item.q}</span>
                  </div>
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {item.a}
                  </div>
                </div>
              ))
            )}
          </div>

          {error && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Ask Input */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskQuestion();
              }}
              placeholder="এই ডকুমেন্টের মূল তথ্য কী? বা নির্দিষ্ট কোনো প্রশ্ন করুন..."
              className="flex-1 px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              disabled={loading || !question.trim()}
              onClick={handleAskQuestion}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow disabled:opacity-40"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
