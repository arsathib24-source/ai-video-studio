'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Check, X, Sparkles, Volume2 } from 'lucide-react';

interface QuickVoiceToTextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickVoiceToTextModal: React.FC<QuickVoiceToTextModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lang, setLang] = useState<'bn-BD' | 'en-US'>('bn-BD');
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
        };

        recognition.onerror = (e: any) => {
          console.warn('[SpeechRecognition] Error:', e);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  if (!isOpen) return null;

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই বা মাইক্রোফোন পারমিশন প্রয়োজন। নিচে টেক্সট লিখুন বা অন্য ব্রাউজারে চেষ্টা করুন।');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const copyTranscript = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0b101e] border border-slate-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Voice to Text (Audio Transcribe)
              </h3>
              <p className="text-[11px] text-slate-400">
                কথা বলুন—এআই স্বয়ংক্রিয়ভাবে বাংলায় নিখুঁত টেক্সট লিখবে
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

        {/* Language selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLang('bn-BD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              lang === 'bn-BD'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            বাংলা (Bangladesh)
          </button>
          <button
            onClick={() => setLang('en-US')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              lang === 'en-US'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            English (US)
          </button>
        </div>

        {/* Transcribed Text Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">ট্রান্সক্রাইব হওয়া টেক্সট (Output)</label>
            {transcript && (
              <button
                onClick={copyTranscript}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            )}
          </div>
          <textarea
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="মাইক্রোফোনে ক্লিক করে কথা বলা শুরু করুন..."
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition leading-relaxed"
          />
        </div>

        {/* Big Mic Button */}
        <div className="flex flex-col items-center justify-center pt-2">
          <button
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition duration-300 ${
              isRecording
                ? 'bg-red-500 text-white animate-bounce shadow-red-500/50 ring-4 ring-red-500/30'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/30 hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <span className="text-xs font-bold text-slate-300 mt-2">
            {isRecording ? 'শুনছি... কথা বলুন' : 'কথা বলতে ট্যাপ করুন'}
          </span>
        </div>
      </div>
    </div>
  );
};
