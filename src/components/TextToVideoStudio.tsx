'use client';

import React, { useState } from 'react';
import { Wand2, Sparkles, Download, Play, RefreshCw, AlertCircle, Copy, Check } from 'lucide-react';

interface TextToVideoStudioProps {
  geminiKey?: string;
  falKey?: string;
  replicateKey?: string;
  onOpenSettings: () => void;
}

const PROMPT_SUGGESTIONS = [
  'A majestic golden eagle soaring above misty Himalayan mountain peaks at sunrise, cinematic 8k photorealistic.',
  'Futuristic Dhaka city in the year 2080 with neon flying cars and rain reflections, cinematic cyberpunk style.',
  'Extreme close-up of a tiny glowing mechanical beetle walking across a mossy forest floor, macro lens depth of field.',
  'Cinematic underwater scene of a bioluminescent giant whale gliding beside a deep-sea submarine.',
];

export const TextToVideoStudio: React.FC<TextToVideoStudioProps> = ({
  geminiKey,
  falKey,
  replicateKey,
  onOpenSettings,
}) => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('free_stock');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState(5);
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('অনুগ্রহ করে একটি ভিডিও প্রম্পট লিখুন।');
      return;
    }

    if (!model.startsWith('free_') && !falKey && !replicateKey) {
      setError('পেইড মডেল চালানোর জন্য Fal.ai বা Replicate Key প্রয়োজন। সম্পূর্ণ ফ্রিতে তৈরি করতে "Free Real 4K Video" বা "Free FLUX AI" নির্বাচন করুন।');
      onOpenSettings();
      return;
    }

    setError('');
    setLoading(true);
    setStatusMessage('প্রম্পট প্রসেসিং ও এআই ভিডিও মডেল রান হচ্ছে... (সাধারণত ১-২ মিনিট লাগতে পারে)');

    try {
      const res = await fetch('/api/generate/text-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          aspectRatio,
          duration,
          enhancePrompt,
          provider: model === 'cogvideox' ? 'replicate' : 'fal',
          apiKey: model === 'cogvideox' ? replicateKey : falKey,
          geminiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Video generation failed.');
      }

      setVideoUrl(data.videoUrl);
      setStatusMessage('ভিডিও সফলভাবে তৈরি হয়েছে!');
    } catch (err: any) {
      setError(err?.message || 'ভিডিও তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form & Controls */}
      <div className="lg:col-span-7 space-y-6 bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-400" />
            <span>Text-to-Video Generator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            আপনার কল্পনাকে সরাসরি বাস্তব ভিডিওতে রূপান্তর করুন। Gemini আপনার প্রম্পটকে স্বয়ংক্রিয়ভাবে সিনেম্যাটিক বানিয়ে দেবে।
          </p>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">ভিডিও প্রম্পট (Prompt)</label>
            <div className="flex items-center space-x-1.5">
              <input
                type="checkbox"
                id="enhance"
                checked={enhancePrompt}
                onChange={(e) => setEnhancePrompt(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 bg-slate-900"
              />
              <label htmlFor="enhance" className="text-[11px] text-indigo-300 flex items-center gap-1 cursor-pointer">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Gemini AI Enhance
              </label>
            </div>
          </div>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="বর্ণনা করুন আপনি কেমন ভিডিও দেখতে চান (যেমন: A futuristic city in rain with neon reflections, cinematic 8k photorealistic...)"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Prompt Ideas */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">উদাহরণ প্রম্পট (Idea Suggestions):</span>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(s)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-300 text-left truncate max-w-xs transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* AI Model */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>AI Video Model</span>
              {model.startsWith('free_') && (
                <span className="text-[10px] text-emerald-400 font-semibold">১০০% ফ্রি</span>
              )}
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="free_stock">🌟 Free Real 4K Video (১০০% ফ্রি - কোনো কি ছাড়া)</option>
              <option value="free_flux">✨ Free FLUX AI Motion (১০০% ফ্রি)</option>
              <option value="minimax">Minimax Hailuo (Ultra Realistic - Fal.ai)</option>
              <option value="kling">Kling 1.5 (High Motion - Fal.ai)</option>
              <option value="luma">Luma Dream Machine (Fal.ai)</option>
              <option value="cogvideox">CogVideoX (Replicate)</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">অ্যাসপেক্ট রেশিও (Size)</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 border border-slate-700 rounded-lg text-center text-xs">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`py-1 rounded ${aspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                16:9
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`py-1 rounded ${aspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                9:16
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                className={`py-1 rounded ${aspectRatio === '1:1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                1:1
              </button>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">সময়কাল (Duration)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={5}>৫ সেকেন্ড (5s)</option>
              <option value={10}>১০ সেকেন্ড (10s)</option>
              <option value={15}>১৫ সেকেন্ড (15s)</option>
              <option value={30}>৩০ সেকেন্ড (30s)</option>
              <option value={60}>৬০ সেকেন্ড (১ মিনিট)</option>
            </select>
          </div>
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
          className="w-full py-3.5 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>ভিডিও তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>ভিডিও জেনারেট করুন (Generate Video)</span>
            </>
          )}
        </button>

        {loading && (
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-center">
            <p className="text-xs text-indigo-200 animate-pulse">{statusMessage}</p>
          </div>
        )}
      </div>

      {/* Right Column: Video Preview Player */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>আউটপুট প্রিভিউ (Video Player)</span>
            </h3>
            {videoUrl && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyUrl}
                  title="Copy video URL"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={videoUrl}
                  download="generated-video.mp4"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            )}
          </div>

          <div
            className={`w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative ${
              aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[550px]' : 'aspect-video'
            }`}
          >
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-6 text-slate-500 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-600">
                  <Play className="w-6 h-6 ml-0.5" />
                </div>
                <p className="text-xs">ভিডিও তৈরি হলে এখানে প্লে হবে</p>
                <p className="text-[10px] text-slate-600">Full HD MP4 Preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
