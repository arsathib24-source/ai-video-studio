'use client';

import React, { useState, useEffect } from 'react';
import { MainNavTab } from './Sidebar';
import {
  Search,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Image as ImageIcon,
  Film,
  Volume2,
  Mic,
  PenTool,
  Menu,
  Zap,
  Home,
  Grid,
  Clock,
  Heart,
  ChevronRight,
  Copy,
  Check,
  Play,
  Pause,
  Flame,
  UserCheck,
  BookOpen,
  Bot,
  SlidersHorizontal,
  Key,
} from 'lucide-react';
import { QuickTTSModal } from './QuickTTSModal';
import { QuickVoiceToTextModal } from './QuickVoiceToTextModal';
import { MOCKUP_ASSETS } from '@/lib/mockup-assets';

interface HomeLaunchpadProps {
  onSelectStudio: (
    tab: MainNavTab,
    options?: { prompt?: string; subTab?: 'shorts' | 't2v' | 'i2v' | 'avatar' }
  ) => void;
  onOpenSettings: () => void;
  onToggleMobileMenu?: () => void;
  onOpenWelcome?: () => void;
}

export const HomeLaunchpad: React.FC<HomeLaunchpadProps> = ({
  onSelectStudio,
  onOpenSettings,
  onToggleMobileMenu,
  onOpenWelcome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'tools' | 'history' | 'saved'>('home');
  const [isTTSOpen, setIsTTSOpen] = useState(false);
  const [isSTTOpen, setIsSTTOpen] = useState(false);

  // Creative Prompt Omnibar
  const [promptText, setPromptText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Voice Sampler
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const quickIdeas = [
    { label: '🎬 ব্ল্যাকহোলের অজানা ৫টি তথ্য', studio: 'videos' as MainNavTab, subTab: 'shorts' as const, prompt: 'রহস্যময় ব্ল্যাকহোলের অজানা ৫টি তথ্য' },
    { label: '🌅 শান্ত গ্রামীণ বাংলা সূর্যাস্ত ৮K', studio: 'images' as MainNavTab, prompt: 'A peaceful rural Bangladeshi village at sunset, golden light, river reflection, 8k realistic' },
    { label: '🚀 Cyberpunk Dhaka 2099', studio: 'images' as MainNavTab, prompt: 'Cyberpunk Dhaka city in year 2099, neon holograms, flying vehicles, rainy night, 8k cinematic' },
    { label: '📱 Viral Motivation Reel', studio: 'videos' as MainNavTab, subTab: 'shorts' as const, prompt: 'সফল হওয়ার ৩টি গোপন বৈজ্ঞানিক সূত্র যা আপনার জীবন বদলে দেবে' },
    { label: '🗣️ AI News Anchor', studio: 'videos' as MainNavTab, subTab: 'avatar' as const, prompt: 'আজকের প্রধান আন্তর্জাতিক প্রযুক্তি সংবাদে আপনাদের স্বাগতম।' },
  ];

  const sampleVoices = [
    { id: 'bn-pradeep', name: 'প্রদীপ (Pradeep)', lang: 'বাংলা', gender: 'পুরুষ (স্পষ্ট ও উদ্যমী)', tag: 'Viral Reels' },
    { id: 'bn-nabanita', name: 'নবনিতা (Nabanita)', lang: 'বাংলা', gender: 'নারী (গল্প ও ডকুমেন্টারি)', tag: 'Storytelling' },
    { id: 'en-christopher', name: 'Christopher', lang: 'English', gender: 'Male (Deep Cinematic)', tag: 'Cinematic' },
    { id: 'en-jenny', name: 'Jenny', lang: 'English', gender: 'Female (Modern & Friendly)', tag: 'Podcast' },
  ];

  const handleVoicePlay = (id: string) => {
    if (playingVoice === id) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingVoice(null);
      return;
    }

    setPlayingVoice(id);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = id.startsWith('bn')
        ? 'আসসালামু আলাইকুম, AI ভিডিও স্টুডিওতে স্বাগতম।'
        : 'Welcome to your next-generation creative AI studio.';
      const utt = new SpeechSynthesisUtterance(text);
      utt.onend = () => setPlayingVoice(null);
      utt.onerror = () => setPlayingVoice(null);
      window.speechSynthesis.speak(utt);
    } else {
      setTimeout(() => setPlayingVoice(null), 3000);
    }
  };

  const handleCopyPrompt = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="w-full space-y-8 pb-20 select-none">
      {/* ========================================================
          1. CLEAN MINIMALIST TOP NAV HEADER
         ======================================================== */}
      <header className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        {/* Left: Clean Identity */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black text-white tracking-tight">
                Creative Studio
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
              অল-ইন-ওয়ান AI ভিডিও, ৮K ইমেজ ও রিয়েল হিউম্যান ভয়েস জেনারেটর
            </p>
          </div>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center space-x-2.5">
          <div className="relative hidden md:block w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search studios..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">API Keys</span>
          </button>

          <div
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow cursor-pointer hover:scale-105 transition"
            title="Anisur Rahman"
          >
            AR
          </div>
        </div>
      </header>

      {/* ========================================================
          2. LUXURY CINEMATIC HERO & UNIFIED PROMPT BAR
         ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#13172c] via-[#0d1020] to-[#070914] border border-indigo-500/20 p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Ambient violet light flare */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-purple-600/15 blur-[100px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-indigo-600/10 blur-[80px] pointer-events-none rounded-full"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Next-Generation Creative AI Studio</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Generate Cinema-Grade Video &{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
              8K Visuals
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            প্রাকৃতিক বাংলা ভয়েসওভার সহ স্বয়ংক্রিয় ৯:১৬ রিলস, ৮K ফটোরিয়ালিস্টিক ছবি, টকিং অবতার ও মাল্টি-মডেল এআই—সবকিছু তৈরি করুন এক ক্লিকে।
          </p>
        </div>

        {/* Unified Studio Prompt Omnibar */}
        <div className="relative z-10 mt-7 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-black/60 border border-slate-700/60 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 backdrop-blur-xl transition shadow-2xl">
            <div className="flex items-center flex-1 px-3 py-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="যেকোনো ভিডিও বা ছবির ধারণা লিখুন (যেমন: 'সূর্যাস্তে শান্ত গ্রামীণ নদী' বা 'স্পেস সায়েন্সের ৩টি রহস্য')..."
                className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Direct Studio Launch Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectStudio('videos', { prompt: promptText, subTab: 'shorts' })}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition active:scale-95"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Create Video</span>
              </button>

              <button
                onClick={() => onSelectStudio('images', { prompt: promptText })}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Generate 8K</span>
              </button>
            </div>
          </div>

          {/* Quick Idea Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-400 font-semibold shrink-0">Quick Ideas:</span>
            {quickIdeas.map((idea, i) => (
              <button
                key={i}
                onClick={() => {
                  setPromptText(idea.prompt);
                  onSelectStudio(idea.studio, { prompt: idea.prompt, subTab: idea.subTab });
                }}
                className="shrink-0 px-3 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 shadow-sm"
              >
                <span>{idea.label}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FOUR MAJOR STUDIO CARDS (Spacious & High-End)
         ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>Primary Creative Studios</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">৪টি মূল ক্রিয়েটিভ ইঞ্জিন</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Video & Auto Shorts */}
          <div
            onClick={() => onSelectStudio('videos', { subTab: 'shorts' })}
            className="group cursor-pointer rounded-2xl bg-[#0b101e] hover:bg-[#11182c] border border-slate-800/80 hover:border-pink-500/50 p-5 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition duration-300">
                  <Film className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300">
                  Viral 9:16
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:text-pink-300 transition">
                Auto Shorts Studio
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                বাংলা ভয়েসওভার ও সিনেমাটিক ৪K ফুটেজ সহ রেডি-টু-পোস্ট ৯:১৬ রিলস তৈরি।
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-pink-400">
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: 8K Image Studio */}
          <div
            onClick={() => onSelectStudio('images')}
            className="group cursor-pointer rounded-2xl bg-[#0b101e] hover:bg-[#11182c] border border-slate-800/80 hover:border-emerald-500/50 p-5 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition duration-300">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  100% Free 8K
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition">
                8K Image Studio
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                FLUX.1 দিয়ে আল্ট্রা-ফটোরিয়ালিস্টিক, ৩D অ্যানিমেশন, কার্টুন ও অ্যানিমে ছবি।
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Talking Avatar */}
          <div
            onClick={() => onSelectStudio('videos', { subTab: 'avatar' })}
            className="group cursor-pointer rounded-2xl bg-[#0b101e] hover:bg-[#11182c] border border-slate-800/80 hover:border-purple-500/50 p-5 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition duration-300">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  Lip-Sync AI
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:text-purple-300 transition">
                Talking Avatar Studio
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                মানুষের যেকোনো ছবি ও অডিও আপলোড করে নিখুঁত কথা বলানো ভিডিও জেনারেশন।
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Multi-AI Chat */}
          <div
            onClick={() => onSelectStudio('chat')}
            className="group cursor-pointer rounded-2xl bg-[#0b101e] hover:bg-[#11182c] border border-slate-800/80 hover:border-indigo-500/50 p-5 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition duration-300">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                  Multi-LLM
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition">
                Multi-AI Chat Hub
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                GPT-4o, Claude 3.5 Sonnet, Gemini 2.0 ও DeepSeek-R1 দিয়ে প্রশ্ন ও কোডিং।
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-indigo-400">
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SLEEK NEURAL VOICEOVER SAMPLER
         ======================================================== */}
      <section className="rounded-3xl bg-[#0a0e1c] border border-slate-800/80 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Neural Voiceover Sampler</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ক্লিক করে সরাসরি বাংলা ও ইংরেজি প্রাকৃতিক কণ্ঠের নমুনা শুনুন
            </p>
          </div>

          <button
            onClick={() => setIsTTSOpen(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center gap-1.5"
          >
            <span>Open Full Voiceover Tool</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleVoices.map((v) => {
            const isPlaying = playingVoice === v.id;
            return (
              <div
                key={v.id}
                className={`p-3.5 rounded-2xl border transition ${
                  isPlaying
                    ? 'bg-blue-950/40 border-blue-500/60 shadow'
                    : 'bg-[#0d1222] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400">{v.lang}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                    {v.tag}
                  </span>
                </div>

                <div className="text-xs font-extrabold text-white">{v.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{v.gender}</div>

                <button
                  onClick={() => handleVoicePlay(v.id)}
                  className={`w-full mt-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isPlaying
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play Sample</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          5. INSPIRATION SHOWCASE GALLERY
         ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Inspiration & Prompts</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              যেকোনো প্রম্পট কপি করুন অথবা <strong>Remix</strong> এ ক্লিক করে সরাসরি তৈরি করুন
            </p>
          </div>

          <button
            onClick={() => onSelectStudio('images')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCKUP_ASSETS.recentGenerations.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0b101e] border border-slate-800/80 hover:border-slate-700 p-3.5 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 relative">
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: item.svgThumb }}
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/70 text-white">
                    {item.badge}
                  </span>
                </div>

                <div className="pt-3">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {item.prompt}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center gap-2">
                <button
                  onClick={() => handleCopyPrompt(item.id, item.prompt)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectStudio('images', { prompt: item.prompt })}
                  className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition shadow"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Remix</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals for Quick TTS and STT */}
      <QuickTTSModal isOpen={isTTSOpen} onClose={() => setIsTTSOpen(false)} />
      <QuickVoiceToTextModal isOpen={isSTTOpen} onClose={() => setIsSTTOpen(false)} />

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#080d19]/95 backdrop-blur-xl border-t border-slate-800/80 py-2.5 px-6 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveBottomNav('home')}
          className="flex flex-col items-center"
        >
          <Home className={`w-5 h-5 ${activeBottomNav === 'home' ? 'text-purple-400' : 'text-slate-500'}`} />
          <span className="text-[10px] font-bold text-slate-300 mt-1">Home</span>
        </button>

        <button
          onClick={() => {
            setActiveBottomNav('tools');
            onSelectStudio('videos');
          }}
          className="flex flex-col items-center"
        >
          <Grid className={`w-5 h-5 ${activeBottomNav === 'tools' ? 'text-purple-400' : 'text-slate-500'}`} />
          <span className="text-[10px] font-bold text-slate-300 mt-1">Studios</span>
        </button>

        <button
          onClick={() => {
            setActiveBottomNav('history');
            onSelectStudio('notebook');
          }}
          className="flex flex-col items-center"
        >
          <Clock className={`w-5 h-5 ${activeBottomNav === 'history' ? 'text-purple-400' : 'text-slate-500'}`} />
          <span className="text-[10px] font-bold text-slate-300 mt-1">Docs</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center"
        >
          <SlidersHorizontal className="w-5 h-5 text-slate-500" />
          <span className="text-[10px] font-bold text-slate-300 mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
};
