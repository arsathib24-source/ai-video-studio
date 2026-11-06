'use client';

import React, { useState } from 'react';
import { UserCheck, Upload, Volume2, Play, Download, RefreshCw, AlertCircle, Sparkles, Mic } from 'lucide-react';
import { AVAILABLE_VOICES } from '@/lib/voices';

interface TalkingAvatarStudioProps {
  falKey?: string;
  replicateKey?: string;
  onOpenSettings: () => void;
}

const PRESET_AVATARS = [
  {
    id: 'male-bd-1',
    name: 'প্রফেশনাল উপস্থাপক (Male Presenter)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'female-bd-1',
    name: 'প্রফেশনাল উপস্থাপিকা (Female Presenter)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'male-tech-1',
    name: 'টেক কনটেন্ট ক্রিয়েটর (Tech Creator)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
];

export const TalkingAvatarStudio: React.FC<TalkingAvatarStudioProps> = ({
  falKey,
  replicateKey,
  onOpenSettings,
}) => {
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(PRESET_AVATARS[0].url);
  const [inputMode, setInputMode] = useState<'text' | 'audio'>('text');
  const [scriptText, setScriptText] = useState('হ্যালো! আমি একটি এআই অবতার। আমি রিয়েল মানুষের কণ্ঠ দিয়ে যেকোনো কথা বলতে পারি।');
  const [voice, setVoice] = useState('bn-BD-PradeepNeural');
  const [audioUrl, setAudioUrl] = useState('');
  const [model, setModel] = useState('fal');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleCustomFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedAvatarUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAudioUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedAvatarUrl) {
      setError('অনুগ্রহ করে একটি মুখ বা অবতার নির্বাচন করুন।');
      return;
    }

    if (inputMode === 'text' && !scriptText.trim()) {
      setError('অনুগ্রহ করে অবতারের বলার জন্য কিছু টেক্সট লিখুন।');
      return;
    }

    if (!falKey && !replicateKey) {
      setError('Talking Avatar জেনারেট করার জন্য Fal.ai বা Replicate API Key প্রয়োজন। সেটিংস থেকে কি (Key) সেট করুন।');
      onOpenSettings();
      return;
    }

    setError('');
    setLoading(true);
    setStatusMessage('কণ্ঠের সাথে মুখের ঠোঁট ও অভিব্যক্তি সিঙ্ক হচ্ছে... (১-২ মিনিট লাগতে পারে)');

    try {
      const res = await fetch('/api/generate/talking-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedAvatarUrl,
          text: inputMode === 'text' ? scriptText.trim() : undefined,
          voice,
          audioUrl: inputMode === 'audio' ? audioUrl : undefined,
          provider: model,
          apiKey: model === 'replicate' ? replicateKey : falKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Avatar generation failed.');
      }

      setVideoUrl(data.videoUrl);
      setStatusMessage('টকিং অবতার ভিডিও প্রস্তুত!');
    } catch (err: any) {
      setError(err?.message || 'টকিং অবতার ভিডিও তৈরিতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Config */}
      <div className="lg:col-span-7 space-y-6 bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <span>AI Real Human Talking Avatar Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            রিয়েল মানুষের ছবি এবং বাস্তব কণ্ঠ দিয়ে পারফেক্ট লিপ-সিঙ্ক (Lip-sync) ভিডিও তৈরি করুন।
          </p>
        </div>

        {/* Avatar Face Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">১. মানুষের চেহারা / অবতার নির্বাচন করুন</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {PRESET_AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => setSelectedAvatarUrl(av.url)}
                className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition ${
                  selectedAvatarUrl === av.url ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img src={av.url} alt={av.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </button>
            ))}

            {/* Upload Custom Face */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl aspect-square cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition text-center p-2">
              <Upload className="w-5 h-5 text-indigo-400 mb-1" />
              <span className="text-[10px] font-medium text-slate-300">নিজস্ব ছবি আপলোড</span>
              <input type="file" accept="image/*" onChange={handleCustomFaceUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Input Mode Toggle */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-300 block">২. অবতারের কণ্ঠ ও বক্তব্য</label>
          <div className="flex space-x-2 bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                inputMode === 'text' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              টেক্সট ও রিয়েল ভয়েস (Text to Speech)
            </button>
            <button
              type="button"
              onClick={() => setInputMode('audio')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                inputMode === 'audio' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              রেকর্ড করা অডিও ফাইল (Audio File)
            </button>
          </div>

          {inputMode === 'text' ? (
            <div className="space-y-3">
              <textarea
                rows={3}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="অবতার কী বলবে তা লিখুন..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />

              {/* Voice Selector */}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">রিয়েল হিউম্যান ভয়েস</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {AVAILABLE_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl text-center bg-slate-900/50">
              <Mic className="w-7 h-7 text-indigo-400 mx-auto mb-2" />
              <label className="cursor-pointer text-xs text-indigo-300 hover:underline">
                অডিও ফাইল নির্বাচন করুন (.mp3, .wav)
                <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
              </label>
              {audioUrl && <p className="text-[11px] text-emerald-400 mt-1">অডিও আপলোড হয়েছে!</p>}
            </div>
          )}
        </div>

        {/* Model choice */}
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1">লিপ-সিঙ্ক ইঞ্জিন (Lip-Sync Engine)</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="fal">Fal.ai LatentSync (Ultra Realistic Lip & Face Sync)</option>
            <option value="replicate">Replicate SadTalker</option>
          </select>
        </div>

        {error && (
          <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGenerate}
          className="w-full py-3.5 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center space-x-2 transition"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>অবতার ভিডিও তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              <span>টকিং অবতার তৈরি করুন (Generate Talking Avatar)</span>
            </>
          )}
        </button>

        {loading && (
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-center">
            <p className="text-xs text-indigo-200 animate-pulse">{statusMessage}</p>
          </div>
        )}
      </div>

      {/* Right Column: Output */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>টকিং অবতার ভিডিও</span>
            </h3>
            {videoUrl && (
              <a
                href={videoUrl}
                download="talking-avatar.mp4"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}
          </div>

          <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : selectedAvatarUrl ? (
              <div className="relative w-full h-full">
                <img src={selectedAvatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center p-4">
                  <Play className="w-8 h-8 text-white/80 mb-2" />
                  <p className="text-xs text-slate-200 font-medium">ভিডিও জেনারেট হলে অবতার কথা বলবে</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 text-slate-500">
                <p className="text-xs">অবতার প্রিভিউ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
