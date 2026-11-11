'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Sliders,
  Layers,
  Wand2,
} from 'lucide-react';
import { MOCKUP_ASSETS } from '@/lib/mockup-assets';

interface ImageStudioProps {
  geminiKey?: string;
  initialPrompt?: string;
  onOpenSettings: () => void;
  onBack?: () => void;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({
  initialPrompt,
  onOpenSettings,
  onBack,
}) => {
  const [mode, setMode] = useState<'text-to-image' | 'image-to-image'>('text-to-image');
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      'A peaceful rural Bangladeshi village, morning sunlight, green nature, a house, cinematic, realistic'
  );
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('9:16');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activePreviewModal, setActivePreviewModal] = useState<string | null>(null);

  // Dynamic history that prepends newly generated images
  const [recentItems, setRecentItems] = useState(MOCKUP_ASSETS.recentGenerations);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('অনুগ্রহ করে একটি ছবি তৈরির বর্ণনা (প্রম্পট) লিখুন।');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ছবি তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }

      setImageUrl(data.imageUrl);

      // Add to recent generations
      const newItem = {
        id: `rec-${Date.now()}`,
        title: prompt.slice(0, 24) + '...',
        prompt: prompt,
        style: selectedStyle,
        aspectRatio: aspectRatio,
        badge: 'FLUX.1 8K',
        gradient: 'from-purple-900 to-indigo-950',
        imageUrl: data.imageUrl,
      };

      setRecentItems((prev: any) => [newItem, ...prev.slice(0, 5)]);
    } catch (err: any) {
      setError(err?.message || 'ছবি তৈরি করা সম্ভব হয়নি। ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    if (imageUrl) {
      navigator.clipboard.writeText(window.location.origin + imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Top Header matching Mockup Screen 3 */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-[#0b101e] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition shadow flex items-center gap-1.5"
            title="Go back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold">Back to Home</span>
          </button>

          <div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Image Generator</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                FLUX.1 8K Free
              </span>
            </h1>
            <p className="hidden sm:block text-xs text-slate-400 mt-0.5">
              Create ultra-high-definition photorealistic 8K art, avatars, and cinematic visuals
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-2.5 rounded-2xl border transition shadow flex items-center gap-1.5 text-xs font-bold ${
            isFavorite
              ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
              : 'bg-[#0b101e] border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Save to favorites"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Favorite'}</span>
        </button>
      </div>

      {/* Responsive Grid: On PC/Laptop, split into 2 Columns (7:5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Controls, Prompts, Styles, Ratios): col-span-7 */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Selector Switcher Pills */}
          <div className="flex p-1.5 rounded-2xl bg-[#0b101d] border border-slate-800/90 shadow-inner">
            <button
              type="button"
              onClick={() => setMode('text-to-image')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                mode === 'text-to-image'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Text to Image
            </button>

            <button
              type="button"
              onClick={() => setMode('image-to-image')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                mode === 'image-to-image'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Image to Image
            </button>
          </div>

          {mode === 'image-to-image' && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center justify-between">
              <span>💡 ইমেজ-টু-ইমেজ মোডে রেফারেন্স ইমেজ দিয়ে রিস্টাইল বা এনহ্যান্স করুন।</span>
              <button
                onClick={() => setMode('text-to-image')}
                className="text-[11px] underline font-bold"
              >
                Switch to Text
              </button>
            </div>
          )}

          {/* Section: Describe your image */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-200">
                Describe your image
              </label>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    'A futuristic smart city in Bangladesh in 2080, neon holographic bridges, flying vehicles, cyberpunk sunset, 8k raw photo'
                  )
                }
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
              >
                <Wand2 className="w-3 h-3" />
                <span>AI Magic Idea</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-[#0b101e] border border-slate-800 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition p-3.5 shadow-inner">
              <textarea
                rows={4}
                value={prompt}
                maxLength={500}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A peaceful rural Bangladeshi village, morning sunlight, green nature, a house, cinematic, realistic"
                className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              />

              {/* Bottom row inside textarea */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-1">
                <span className="text-[10px] text-slate-500">
                  FLUX.1 8K • 100% Free • No Key Needed
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {prompt.length} / 500
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Style Selection with Visual Thumbnails */}
          <div className="space-y-2.5">
            <label className="text-xs sm:text-sm font-bold text-slate-200 block">
              Style Preset
            </label>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
              {MOCKUP_ASSETS.styles.map((styleItem) => {
                const isSelected = selectedStyle === styleItem.id;
                return (
                  <div
                    key={styleItem.id}
                    onClick={() => setSelectedStyle(styleItem.id)}
                    className={`group cursor-pointer rounded-2xl p-2 transition-all duration-200 flex flex-col items-center relative ${
                      isSelected
                        ? 'bg-purple-950/40 border-2 border-purple-500 shadow-lg shadow-purple-500/25 -translate-y-0.5'
                        : 'bg-[#0b101e] border border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 relative shadow-inner">
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: styleItem.svgArt }}
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-purple-500 shadow"></div>
                      )}
                    </div>

                    <span
                      className={`mt-2 text-xs font-bold transition text-center truncate w-full ${
                        isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {styleItem.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Aspect Ratio Cards */}
          <div className="space-y-2.5">
            <label className="text-xs sm:text-sm font-bold text-slate-200 block">
              Aspect Ratio
            </label>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
              {MOCKUP_ASSETS.aspectRatios.map((ratio) => {
                const isSelected = aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id as any)}
                    className={`p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-purple-950/40 border-2 border-purple-500 shadow-lg shadow-purple-500/25 -translate-y-0.5 text-white'
                        : 'bg-[#0b101e] border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div
                      className={`border-2 rounded mb-1.5 transition ${
                        isSelected ? 'border-purple-400' : 'border-slate-600'
                      } ${ratio.iconWidth}`}
                    ></div>

                    <span className="text-xs font-extrabold">{ratio.label}</span>
                    <span className="text-[10px] text-slate-400">{ratio.sublabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Big Gradient CTA Button: "Generate Image ✨" */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>8K ইমেজ জেনারেট হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>Generate Image</span>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </>
            )}
          </button>
        </div>

        {/* Right Column (Live Result Display & Recent Gallery): col-span-5 */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Generated Result Card */}
          {imageUrl ? (
            <div className="p-5 rounded-3xl bg-[#0b101e] border border-purple-500/40 shadow-2xl space-y-3.5 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>আপনার তৈরি ইমেজ (Generated)</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  8K Ready
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-950 max-h-[480px] mx-auto shadow-inner group flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Generated Result"
                  className="w-full h-full object-cover max-h-[480px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between">
                  <a
                    href={imageUrl}
                    download="ai-generated-image.jpg"
                    className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-purple-500 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>ডাউনলোড (8K)</span>
                  </a>
                  <button
                    onClick={copyUrl}
                    className="p-2.5 rounded-xl bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 transition"
                    title="Copy Link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Standby Placeholder viewport when no image generated yet */
            <div className="p-8 rounded-3xl bg-[#0b101e]/60 border border-slate-800/80 flex flex-col items-center justify-center text-center space-y-3 min-h-[260px]">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Live 8K Output Viewport</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  প্রম্পট লিখে &quot;Generate Image&quot; চাপুন, কয়েক সেকেন্ডেই আল্ট্রা-এইচডি প্রিভিউ এখানে প্রদর্শিত হবে।
                </p>
              </div>
            </div>
          )}

          {/* Section: Recent Generations matching Mockup */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-slate-200">
                Recent Generations
              </h2>
              <span className="text-xs font-bold text-purple-400 cursor-pointer">
                {recentItems.length} Images
              </span>
            </div>

            {/* Grid of recent images */}
            <div className="grid grid-cols-3 gap-2.5">
              {recentItems.slice(0, 3).map((item: any, idx: number) => {
                return (
                  <div
                    key={item.id || idx}
                    onClick={() => {
                      setPrompt(item.prompt);
                      setSelectedStyle(item.style);
                    }}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-[#0b101e] border border-slate-800/80 hover:border-purple-500/60 p-1 transition-all duration-200 hover:-translate-y-0.5 shadow-md flex flex-col"
                  >
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 relative shadow-inner">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full group-hover:scale-105 transition duration-300"
                          dangerouslySetInnerHTML={{ __html: item.svgThumb }}
                        />
                      )}
                      <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-sm">
                        {item.badge}
                      </span>
                    </div>

                    <div className="p-1 pt-1.5">
                      <p className="text-[10px] font-bold text-slate-300 truncate group-hover:text-purple-300 transition">
                        {item.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
