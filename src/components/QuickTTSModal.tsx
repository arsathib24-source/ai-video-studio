'use client';

import React, { useState } from 'react';
import { Volume2, Mic, Play, Pause, Download, RefreshCw, X, Sparkles, Check } from 'lucide-react';
import { AVAILABLE_VOICES, VoiceOption } from '@/lib/voices';

interface QuickTTSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickTTSModal: React.FC<QuickTTSModalProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState(
    'আসসালামু আলাইকুম! এটি একটি সম্পূর্ণ ফ্রি এআই ন্যাচারাল হিউম্যান ভয়েস।'
  );
  const [selectedVoice, setSelectedVoice] = useState('bn-BD-PradeepNeural');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSynthesize = async () => {
    if (!text.trim()) {
      setError('অনুগ্রহ করে ভয়েসের জন্য কিছু টেক্সট লিখুন।');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/generate/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice: selectedVoice,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ভয়েস জেনারেট ব্যর্থ হয়েছে।');

      setAudioUrl(data.audioUrl);
      setDuration(data.duration);

      const audio = new Audio(data.audioUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } catch (err: any) {
      setError(err?.message || 'ভয়েস জেনারেশনে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioElement && audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
      return;
    }

    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0b101e] border border-slate-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Text to Speech (Natural Neural Voice)
              </h3>
              <p className="text-[11px] text-slate-400">
                বাংলা ও ইংরেজি রিয়েল মানুষের মতো স্পষ্ট ভয়েস ওভার
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">ভয়েস টেক্সট (Text)</label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="যা শোনাতে চান তা লিখুন..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Voice Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">ভয়েস চরিত্র (Voice Character)</label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_VOICES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVoice(v.id)}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                  selectedVoice === v.id
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold">{v.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{v.language} • {v.gender}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Audio Player if generated */}
        {audioUrl && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/30 flex items-center justify-between">
            <button
              onClick={togglePlayback}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play Voice'}</span>
            </button>
            <span className="text-[11px] text-slate-400">
              সময়কাল: {duration ? `${duration.toFixed(1)}s` : 'ক্লিয়ার ভয়েস'}
            </span>
            <a
              href={audioUrl}
              download="ai-voiceover.mp3"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white transition"
              title="Download Audio MP3"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleSynthesize}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>ভয়েস তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>ভয়েস রূপান্তর করুন (Generate Speech)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
