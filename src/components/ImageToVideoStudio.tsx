'use client';

import React, { useState } from 'react';
import { Video, Upload, Image as ImageIcon, RefreshCw, AlertCircle, Play, Download, Sparkles } from 'lucide-react';

interface ImageToVideoStudioProps {
  falKey?: string;
  replicateKey?: string;
  onOpenSettings: () => void;
}

export const ImageToVideoStudio: React.FC<ImageToVideoStudioProps> = ({
  falKey,
  replicateKey,
  onOpenSettings,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('Cinematic slow motion, subtle natural camera movement, photorealistic 8k');
  const [model, setModel] = useState('minimax');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('ছবির সাইজ ১০ মেগাবাইটের কম হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!imageUrl) {
      setError('অনুগ্রহ করে একটি ছবি আপলোড করুন অথবা ছবির লিঙ্ক প্রদান করুন।');
      return;
    }

    if (!falKey && !replicateKey) {
      setError('ভিডিও জেনারেট করার জন্য Fal.ai বা Replicate API Key প্রয়োজন। সেটিংস থেকে কী (Key) যুক্ত করুন।');
      onOpenSettings();
      return;
    }

    setError('');
    setLoading(true);
    setStatusMessage('ছবি এনালাইসিস করে অ্যানিমেশন ও ভিডিও মোশন রেন্ডার হচ্ছে... (১-২ মিনিট সময় লাগতে পারে)');

    try {
      const res = await fetch('/api/generate/image-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          prompt,
          model,
          provider: model === 'svd' ? 'replicate' : 'fal',
          apiKey: model === 'svd' ? replicateKey : falKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Image-to-video conversion failed.');
      }

      setVideoUrl(data.videoUrl);
      setStatusMessage('ভিডিও সফলভাবে তৈরি হয়েছে!');
    } catch (err: any) {
      setError(err?.message || 'ছবি থেকে ভিডিও তৈরি ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Input Form */}
      <div className="lg:col-span-7 space-y-6 bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-400" />
            <span>Image-to-Video Animator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            যেকোনো স্থির ছবিকে (Photo/Artwork) জীবন্ত সিনেমাটিক ভিডিওতে রূপান্তর করুন।
          </p>
        </div>

        {/* Image Upload Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">ছবি আপলোড করুন (Upload Image)</label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="w-full sm:w-1/2 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-5 cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition">
              <Upload className="w-8 h-8 text-indigo-400 mb-2" />
              <span className="text-xs font-medium text-slate-200">ফাইল নির্বাচন করুন</span>
              <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WebP (Max 10MB)</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Preview Box */}
            <div className="w-full sm:w-1/2 aspect-video bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden relative">
              {imageUrl ? (
                <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-3 text-slate-600">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-700" />
                  <span className="text-[11px]">ছবির প্রিভিউ</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Motion Prompt */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">মোশন বর্ণনা (Motion Direction Prompt)</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ছবিতে কেমন মোশন চান? (যেমন: River water flowing, gentle wind blowing hair, camera panning)"
            className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* AI Model Selector */}
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">AI Image-to-Video Engine</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="minimax">Minimax Hailuo I2V (Ultra Smooth Motion)</option>
            <option value="kling">Kling 1.5 Image-to-Video</option>
            <option value="luma">Luma Dream Machine I2V</option>
            <option value="svd">Stable Video Diffusion (Replicate SVD)</option>
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
          className="w-full py-3.5 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>ভিডিও অ্যানিমেশন হচ্ছে...</span>
            </>
          ) : (
            <>
              <Video className="w-4 h-4" />
              <span>ছবি থেকে ভিডিও বানান (Animate Image to Video)</span>
            </>
          )}
        </button>

        {loading && (
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-center">
            <p className="text-xs text-indigo-200 animate-pulse">{statusMessage}</p>
          </div>
        )}
      </div>

      {/* Right Column: Output Preview */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>অ্যানিমেটেড ভিডিও আউটপুট</span>
            </h3>
            {videoUrl && (
              <a
                href={videoUrl}
                download="animated-photo.mp4"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative">
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
                <p className="text-xs">জেনারেট করা অ্যানিমেশন এখানে প্লে হবে</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
