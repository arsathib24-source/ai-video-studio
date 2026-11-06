'use client';

import React, { useState } from 'react';
import { Layers, Sparkles, RefreshCw, AlertCircle, Play, Download, Volume2, Film, CheckCircle2, Music, Edit3 } from 'lucide-react';
import { AVAILABLE_VOICES } from '@/lib/voices';

interface AutoShortsStudioProps {
  geminiKey?: string;
  falKey?: string;
  pexelsKey?: string;
  onOpenSettings: () => void;
}

const TOPIC_PRESETS = [
  'রহস্যময় ব্ল্যাকহোলের অজানা ৫টি তথ্য',
  'সফল হওয়ার ৩টি গোপন বৈজ্ঞানিক সূত্র',
  'প্রাচীন মিসরের পিরামিড নিয়ে অজানা রহস্য',
  'ভবিষ্যতের পৃথিবীতে AI যে ৫টি পরিবর্তন আনবে',
  'Top 3 Mind-Blowing Facts About Space',
];

export const AutoShortsStudio: React.FC<AutoShortsStudioProps> = ({
  geminiKey,
  falKey,
  pexelsKey,
  onOpenSettings,
}) => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Bengali');
  const [voice, setVoice] = useState('bn-BD-PradeepNeural');
  const [visualMode, setVisualMode] = useState<'stock_video' | 'ai_image'>('stock_video');
  const [duration, setDuration] = useState(30);
  const [tone, setTone] = useState('Viral & Exciting');

  // Script states
  const [generatingScript, setGeneratingScript] = useState(false);
  const [scriptData, setScriptData] = useState<any>(null);

  // Video rendering states
  const [renderingVideo, setRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState('');
  const [renderedVideoUrl, setRenderedVideoUrl] = useState('');
  const [error, setError] = useState('');

  // Audio testing
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handleGenerateScript = async () => {
    if (!topic.trim()) {
      setError('অনুগ্রহ করে শর্টস তৈরির একটি টপিক লিখুন।');
      return;
    }

    if (!geminiKey) {
      setError('স্ক্রিপ্ট তৈরির জন্য Google Gemini API Key প্রয়োজন। সেটিংস থেকে আপনার কি যুক্ত করুন (ফ্রি)।');
      onOpenSettings();
      return;
    }

    setError('');
    setGeneratingScript(true);
    setRenderedVideoUrl('');

    try {
      const res = await fetch('/api/generate/shorts-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          language,
          targetDuration: duration,
          tone,
          apiKey: geminiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Script generation failed.');
      }

      setScriptData(data.script);
    } catch (err: any) {
      setError(err?.message || 'স্ক্রিপ্ট তৈরি করতে সমস্যা হয়েছে।');
    } finally {
      setGeneratingScript(false);
    }
  };

  const handleTestVoice = async (text: string, sceneIdx: number) => {
    try {
      setPlayingAudio(`scene_${sceneIdx}`);
      const res = await fetch('/api/generate/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });
      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play();
        audio.onended = () => setPlayingAudio(null);
      }
    } catch (e) {
      console.error(e);
      setPlayingAudio(null);
    }
  };

  const handleRenderShorts = async () => {
    if (!scriptData || !scriptData.scenes) {
      setError('প্রথমে স্ক্রিপ্ট তৈরি করুন।');
      return;
    }

    setError('');
    setRenderingVideo(true);
    setRenderProgress('ভয়েস সিন্থেসিস ও প্রতিটি সিনের অডিও তৈরি হচ্ছে...');

    try {
      setRenderProgress(
        visualMode === 'stock_video'
          ? 'রিয়েল স্টক ভিডিও ক্লিপ এবং ভয়েসওভার প্রস্তুত হচ্ছে...'
          : 'AI আর্ট ইমেজ ও ভয়েসওভার প্রস্তুত হচ্ছে...'
      );
      const res = await fetch('/api/generate/render-short', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenes: scriptData.scenes,
          voice,
          aspectRatio: '9:16',
          visualMode,
          pexelsApiKey: pexelsKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Video rendering failed.');
      }

      setRenderedVideoUrl(data.videoUrl);
      setRenderProgress('সম্পূর্ণ ভিডিও রেন্ডার সম্পন্ন হয়েছে!');
    } catch (err: any) {
      setError(err?.message || 'ভিডিও রেন্ডারিং ব্যর্থ হয়েছে।');
    } finally {
      setRenderingVideo(false);
    }
  };

  const filteredVoices = AVAILABLE_VOICES.filter((v) =>
    language === 'Bengali' ? v.language.startsWith('bn') : v.language.startsWith('en')
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form: Topic & Configuration */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-pink-400" />
              <span>Automated Faceless Shorts / Reels Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              এক ক্লিকে সোশ্যাল মিডিয়ার জন্য ট্রেন্ডিং ভাইরাল শর্টস ও রিল তৈরি করুন। স্ক্রিপ্ট, রিয়েল হিউম্যান ভয়েস ও সাবটাইটেল সহ স্বয়ংক্রিয় রেন্ডারিং।
            </p>
          </div>

          {/* Topic Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">ভিডিওর টপিক বা ধারণা (Topic / Idea)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="যেমন: রহস্যময় ব্ল্যাকহোলের অজানা ৫টি তথ্য..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">জনপ্রিয় আইডিয়া (Quick Presets):</span>
            <div className="flex flex-wrap gap-1.5">
              {TOPIC_PRESETS.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(t)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-300 text-left transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Language, Duration & Voice Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            {/* Language */}
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-slate-300 block mb-1.5">ভাষা (Language)</label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  if (e.target.value === 'Bengali') setVoice('bn-BD-PradeepNeural');
                  else setVoice('en-US-ChristopherNeural');
                }}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="English">English (US/UK)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-slate-300 block mb-1.5">ভিডিও সময়কাল (Duration)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-medium text-indigo-300"
              >
                <option value={15}>১৫ সেকেন্ড (15s)</option>
                <option value={30}>৩০ সেকেন্ড (30s - রিলস)</option>
                <option value={60}>৬০ সেকেন্ড (১ মিনিট)</option>
                <option value={90}>৯০ সেকেন্ড (১.৫ মিনিট)</option>
                <option value={120}>১২০ সেকেন্ড (২ মিনিট)</option>
              </select>
            </div>

            {/* Real Human Voice */}
            <div className="sm:col-span-6">
              <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>রিয়েল মানুষের কণ্ঠ (Real Voice)</span>
                <span className="text-[10px] text-emerald-400">Ultra-Realistic</span>
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {filteredVoices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visual Mode Selector (Real Stock Video vs AI Image) */}
          <div className="pt-1">
            <label className="text-xs font-medium text-slate-300 block mb-1.5">ভিজ্যুয়াল ব্যাকগ্রাউন্ড মোড (Visual Mode)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/90 p-1.5 border border-slate-800 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setVisualMode('stock_video')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition ${
                  visualMode === 'stock_video'
                    ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>রিয়েল স্টক ভিডিও (Pexels / Real 4K Clips)</span>
              </button>

              <button
                type="button"
                onClick={() => setVisualMode('ai_image')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition ${
                  visualMode === 'ai_image'
                    ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI আর্ট ছবি (FLUX 9:16 Vertical)</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {visualMode === 'stock_video'
                ? '✓ ১০০% ফ্রি রিয়েল সিনেমাটিক ভিডিও ফুটেজ ব্যবহার হবে (কোনো Fal.ai কী লাগবে না)।'
                : '✓ প্রতি সিনের জন্য FLUX এআই নতুন ৯:১৬ ছবি জেনারেট করে ভিডিও তৈরি করবে।'}
            </p>
          </div>

          {error && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1 Button */}
          <button
            type="button"
            disabled={generatingScript}
            onClick={handleGenerateScript}
            className="w-full py-3 px-4 rounded-xl font-medium text-xs text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 shadow-md shadow-pink-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 transition"
          >
            {generatingScript ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Gemini এআই স্ক্রিপ্ট তৈরি করছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>ধাপ ১: এআই স্ক্রিপ্ট তৈরি করুন (Generate AI Script)</span>
              </>
            )}
          </button>
        </div>

        {/* Script & Scenes Editor Review */}
        {scriptData && (
          <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase text-indigo-400 tracking-wider">জেনারেট করা স্ক্রিপ্ট</span>
                <h3 className="text-base font-bold text-white mt-0.5">{scriptData.title}</h3>
              </div>
              <span className="px-2.5 py-1 text-[11px] rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {scriptData.scenes?.length} Scenes
              </span>
            </div>

            {/* Hook */}
            {scriptData.hook && (
              <div className="p-3 bg-pink-950/30 border border-pink-500/20 rounded-xl">
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block mb-1">🔥 ৩-সেকেন্ড হুক (Hook)</span>
                <p className="text-xs text-pink-200">{scriptData.hook}</p>
              </div>
            )}

            {/* Scenes List */}
            <div className="space-y-3">
              {scriptData.scenes?.map((scene: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-300">দৃশ্য {scene.sceneNumber || idx + 1} ({scene.durationSeconds || 5}s)</span>
                    <button
                      type="button"
                      onClick={() => handleTestVoice(scene.voiceover, idx)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3 text-indigo-400" />
                      <span>{playingAudio === `scene_${idx}` ? 'বাজছে...' : 'কণ্ঠ শুনুন'}</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">ভয়েসওভার লাইন:</span>
                    <p className="text-xs text-slate-200">{scene.voiceover}</p>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 block">ভিজ্যুয়াল প্রম্পট:</span>
                    <p className="text-[11px] text-slate-400 italic line-clamp-2">{scene.visualPrompt}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Step 2: Render Video Button */}
            <button
              type="button"
              disabled={renderingVideo}
              onClick={handleRenderShorts}
              className="w-full py-3.5 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 transition"
            >
              {renderingVideo ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>ভিডিও রেন্ডার হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  <span>ধাপ ২: ৯:১৬ সম্পূর্ণ শর্টস ভিডিও রেন্ডার করুন (Render Full Video)</span>
                </>
              )}
            </button>

            {renderingVideo && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-center">
                <p className="text-xs text-emerald-200 animate-pulse">{renderProgress}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: 9:16 Shorts Video Player Preview */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Play className="w-4 h-4 text-pink-400" />
              <span>৯:১৬ শর্টস প্লেয়ার (Vertical Reel Preview)</span>
            </h3>
            {renderedVideoUrl && (
              <a
                href={renderedVideoUrl}
                download="ai-shorts-video.mp4"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Shorts</span>
              </a>
            )}
          </div>

          <div className="w-full max-w-[320px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative shadow-2xl">
            {renderedVideoUrl ? (
              <video
                src={renderedVideoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-slate-500 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-pink-500/60">
                  <Film className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">৯:১৬ সোশ্যাল মিডিয়া রিল</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">YouTube Shorts, TikTok, Instagram Reels রেডি</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
