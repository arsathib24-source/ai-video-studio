'use client';

import React, { useState, useEffect } from 'react';
import { MainNavTab } from './Sidebar';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Image as ImageIcon,
  Film,
  Volume2,
  Mic,
  Menu,
  Zap,
  UserCheck,
  BookOpen,
  Bot,
  Copy,
  Check,
  Play,
  Pause,
  Key,
  ChevronRight,
  SlidersHorizontal,
  X,
  Send,
  Wand2,
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
  // Slide state: 0 = Video, 1 = Images, 2 = Avatar, 3 = Multi-AI
  const [activeSlide, setActiveSlide] = useState<number>(1); // Default to Slide 2 (matches image: "beyond imagen")
  const [isTTSOpen, setIsTTSOpen] = useState(false);
  const [isSTTOpen, setIsSTTOpen] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  // Auto-rotate slides gently (user can pause by clicking)
  const slides = [
    {
      id: 0,
      slideNumber: '1',
      studio: 'videos' as MainNavTab,
      subTab: 'shorts' as const,
      firstWord: 'beyond',
      secondWord: 'cinema',
      tagline: 'Viral 9:16 Reels & Cinematic Shorts',
      description: 'স্বয়ংক্রিয় বাংলা ভয়েসওভার, ৪K সিনেমাটিক ব্যাকগ্রাউন্ড ও ডায়নামিক সাবটাইটেল সহ রেডি-টু-পোস্ট ভিডিও তৈরি করুন।',
      gradient: 'from-pink-500 via-rose-500 to-indigo-400',
      glowColor: '#ec4899',
      bulletLabel: 'Video Studio',
      ctaText: 'Launch Video Studio',
    },
    {
      id: 1,
      slideNumber: '2',
      studio: 'images' as MainNavTab,
      firstWord: 'beyond',
      secondWord: 'imagen',
      tagline: 'FLUX.1 8K Photorealistic Studio',
      description: 'Create ultra-high definition photorealistic visuals, 3D character renders, and futuristic artwork with prompt perfection.',
      gradient: 'from-purple-400 via-indigo-400 to-pink-400',
      glowColor: '#a855f7',
      bulletLabel: '8K Images',
      ctaText: 'Explore Now',
    },
    {
      id: 2,
      slideNumber: '3',
      studio: 'videos' as MainNavTab,
      subTab: 'avatar' as const,
      firstWord: 'beyond',
      secondWord: 'avatar',
      tagline: 'Real Human Talking Avatar Studio',
      description: 'মানুষের যেকোনো ছবি ও নিজস্ব ভয়েস দিয়ে নিখুঁত লিপ-সিঙ্ক (Lip-sync) সহ জীবন্ত উপস্থাপক ভিডিও জেনারেশন।',
      gradient: 'from-cyan-400 via-blue-500 to-purple-400',
      glowColor: '#38bdf8',
      bulletLabel: 'Talking Avatar',
      ctaText: 'Create Avatar',
    },
    {
      id: 3,
      slideNumber: '4',
      studio: 'chat' as MainNavTab,
      firstWord: 'beyond',
      secondWord: 'mind',
      tagline: 'Multi-LLM Deep Reasoning Hub',
      description: 'DeepSeek-R1, Claude 3.5 Sonnet, GPT-4o এবং Gemini 2.0 দিয়ে জটিল কোডিং ও ক্রিয়েটিভ রিসার্চ সমাধান।',
      gradient: 'from-emerald-400 via-teal-400 to-indigo-400',
      glowColor: '#10b981',
      bulletLabel: 'AI Chat Hub',
      ctaText: 'Start Thinking',
    },
  ];

  const current = slides[activeSlide];

  const handleLaunchCurrent = () => {
    onSelectStudio(current.studio, {
      prompt: customPrompt || undefined,
      subTab: current.subTab,
    });
  };

  const handleCopyPrompt = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

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

  return (
    <div className="w-full space-y-10 pb-20 select-none">
      {/* ========================================================
          1. THE FUTURISTIC HOLO CYBERPUNK SHOWCASE CONTAINER
             (Matches the user reference image layout 1:1)
         ======================================================== */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-indigo-900/40 bg-gradient-to-r from-[#020919] via-[#051433] to-[#140625] min-h-[580px] lg:min-h-[640px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-all duration-700">
        
        {/* Abstract cybernetic sine wave background on the left */}
        <div className="absolute inset-y-0 left-0 w-80 pointer-events-none opacity-25">
          <svg viewBox="0 0 400 800" className="w-full h-full" fill="none">
            <path
              d="M-50 100 C 150 200, 50 400, 250 500 C 350 550, 100 700, -50 800"
              stroke="url(#waveGrad1)"
              strokeWidth="1.5"
            />
            <path
              d="M-50 150 C 180 250, 70 430, 270 530 C 370 580, 120 730, -50 850"
              stroke="url(#waveGrad1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <path
              d="M-50 80 C 120 180, 40 370, 220 470 C 320 520, 80 670, -50 770"
              stroke="url(#waveGrad2)"
              strokeWidth="0.8"
            />
            <defs>
              <linearGradient id="waveGrad1" x1="0" y1="0" x2="400" y2="800" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0" y1="0" x2="400" y2="800" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06b6d4" />
                <stop offset="1" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Vertical laser light lines falling in the background */}
        <div className="absolute top-0 right-1/3 w-[1px] h-48 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent pointer-events-none"></div>
        <div className="absolute top-10 right-1/4 w-[1px] h-64 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent pointer-events-none"></div>
        <div className="absolute top-20 right-12 w-[1px] h-52 bg-gradient-to-b from-transparent via-pink-500/40 to-transparent pointer-events-none"></div>

        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        {/* ----------------------------------------------------
            TOP BAR: Centered HOLO Studio Logo + Minimalist Menu
           ---------------------------------------------------- */}
        <div className="relative z-20 flex items-center justify-between w-full">
          {/* Mobile menu trigger */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Centered HOLO Logo */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveSlide(1)}>
              <span className="text-xl sm:text-2xl font-black tracking-[0.25em] text-white">
                HOLO
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Creative AI
            </span>
          </div>

          {/* Right Hamburger & API Key Link */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold hover:border-purple-500/50 transition backdrop-blur-md"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Keys</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition"
              title="Settings & Menu"
            >
              <div className="w-5 h-3.5 flex flex-col justify-between items-end">
                <span className="w-5 h-0.5 bg-white rounded-full"></span>
                <span className="w-3.5 h-0.5 bg-white rounded-full"></span>
              </div>
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------
            MAIN STAGE: 3-COLUMN HOLOGRAM LAYOUT
            Left: Vertical Slider + Nav Links
            Center: 3D Holographic Cyberpunk Humanoid Bust
            Right: Bold Typographic Statement (.beyond imagen)
           ---------------------------------------------------- */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
          
          {/* === LEFT COLUMN: Slide Tracker & Minimalist Nav === */}
          <div className="lg:col-span-3 flex lg:flex-col justify-between items-start gap-6">
            
            {/* Vertical Slide Indicator */}
            <div className="flex items-center space-x-4">
              <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase rotate-0 lg:-rotate-90 origin-left">
                SLIDE
              </span>
              
              <div className="flex lg:flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm sm:text-base font-black text-white">
                  <span className="text-pink-400 font-extrabold">{current.slideNumber}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400">4</span>
                </div>

                {/* Vertical dash lines with neon active bar */}
                <div className="hidden lg:flex flex-col items-center gap-1.5 py-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        activeSlide === idx
                          ? 'w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-500 shadow-[0_0_10px_#ec4899]'
                          : 'w-1 h-2 bg-slate-800 hover:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Left Nav Menu with Glowing Accent Line */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-[1.5px] bg-gradient-to-r from-pink-500 to-transparent"></div>
                <span className="text-xs font-bold text-white tracking-wider">Home</span>
              </div>

              <div className="space-y-2 text-xs font-semibold pl-8">
                {slides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`block text-left transition duration-200 ${
                      activeSlide === idx
                        ? 'text-pink-400 font-black translate-x-1'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    • {s.bulletLabel}
                  </button>
                ))}
                <button
                  onClick={() => setIsTTSOpen(true)}
                  className="block text-left text-slate-400 hover:text-slate-200 transition"
                >
                  • Voiceover (TTS)
                </button>
              </div>
            </div>
          </div>

          {/* === CENTER COLUMN: 3D Holographic Cyberpunk Bust & Rings === */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative my-4 lg:my-0">
            
            {/* The 3D Holographic Perspective Rings Platform */}
            <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
              
              {/* Perspective 3D Elliptical Glowing Floor Rings */}
              <div className="absolute -bottom-8 w-full max-w-[420px] h-32 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                  <defs>
                    <radialGradient id="platformGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#ec4899" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Soft Radial Ambient Pool */}
                  <ellipse cx="200" cy="80" rx="190" ry="50" fill="url(#platformGlow)" />

                  {/* Outer Concentric Ring */}
                  <ellipse
                    cx="200"
                    cy="80"
                    rx="195"
                    ry="52"
                    stroke="rgba(56, 189, 248, 0.4)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  {/* Middle Dashed Ring */}
                  <ellipse
                    cx="200"
                    cy="80"
                    rx="155"
                    ry="40"
                    stroke="rgba(192, 132, 252, 0.5)"
                    strokeWidth="1.5"
                    strokeDasharray="8 6"
                    fill="none"
                  />
                  {/* Inner Intense Ring */}
                  <ellipse
                    cx="200"
                    cy="80"
                    rx="115"
                    ry="28"
                    stroke="rgba(236, 72, 153, 0.7)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              {/* The 3D Hologram Bust Vector Artwork with Iridescent Contours */}
              <div className="relative z-10 w-full h-full max-w-[320px] max-h-[360px] flex items-center justify-center group cursor-pointer" onClick={handleLaunchCurrent}>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/10 to-transparent blur-2xl rounded-full"></div>
                
                <svg
                  viewBox="0 0 320 380"
                  className="w-full h-full drop-shadow-[0_0_35px_rgba(168,85,247,0.45)] group-hover:scale-105 transition-transform duration-500"
                  fill="none"
                >
                  <defs>
                    {/* Iridescent Cyberpunk Gradient */}
                    <linearGradient id="holoGradient" x1="50" y1="50" x2="280" y2="350" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38bdf8" />
                      <stop offset="0.3" stopColor="#818cf8" />
                      <stop offset="0.6" stopColor="#c084fc" />
                      <stop offset="0.85" stopColor="#ec4899" />
                      <stop offset="1" stopColor="#f43f5e" />
                    </linearGradient>

                    <linearGradient id="neonCyan" x1="0" y1="0" x2="0" y2="100%">
                      <stop stopColor="#38bdf8" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>

                    <linearGradient id="neonPink" x1="0" y1="0" x2="0" y2="100%">
                      <stop stopColor="#f43f5e" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>

                    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Dark base silhouette for depth */}
                  <path
                    d="M 120 70 C 145 35, 205 35, 230 70 C 245 95, 240 140, 245 165 C 248 180, 240 195, 235 210 C 230 225, 220 235, 200 245 L 210 280 C 225 295, 260 320, 275 355 L 75 355 C 90 320, 125 295, 140 280 L 150 245 C 130 235, 120 225, 115 210 C 110 195, 102 180, 105 165 C 110 140, 105 95, 120 70 Z"
                    fill="#080c1e"
                    opacity="0.8"
                  />

                  {/* Topographical Holographic Contour Lines (Side Profile / Cybernetic Humanoid) */}
                  <g filter="url(#glowFilter)" stroke="url(#holoGradient)" strokeWidth="1.8" strokeLinecap="round" opacity="0.95">
                    {/* Head curves */}
                    <path d="M 140 60 C 160 42, 200 42, 215 65" />
                    <path d="M 130 80 C 155 58, 210 58, 230 85" />
                    <path d="M 122 100 C 150 78, 220 78, 240 108" />
                    <path d="M 115 125 C 145 100, 230 100, 245 132" />
                    <path d="M 110 150 C 140 125, 238 125, 248 158" />

                    {/* Face Profile Contours (Cheekbone, Brow, Jaw) */}
                    <path d="M 112 175 C 140 150, 185 145, 210 160 C 225 170, 248 178, 246 195" />
                    <path d="M 118 195 C 145 175, 180 170, 205 182 C 220 190, 240 200, 235 218" />
                    <path d="M 125 215 C 150 195, 180 192, 200 205 C 215 215, 228 225, 220 238" />

                    {/* Lips & Chin curves */}
                    <path d="M 135 235 C 155 220, 180 218, 195 228 C 205 235, 212 245, 205 255" />
                    <path d="M 145 255 C 165 240, 185 240, 200 252 C 208 260, 200 270, 192 275" />

                    {/* Cybernetic Neck & Collar Ribs */}
                    <path d="M 145 278 C 165 265, 185 265, 195 280" />
                    <path d="M 140 295 C 165 280, 190 280, 205 300" />
                    <path d="M 132 312 C 165 295, 200 295, 220 320" />
                    <path d="M 120 330 C 165 310, 215 310, 240 340" />
                    <path d="M 100 350 C 160 325, 230 325, 265 360" />
                    <path d="M 80 370 C 150 340, 250 340, 285 378" />

                    {/* High-frequency glowing hairline bun / detail */}
                    <ellipse cx="118" cy="175" rx="18" ry="24" stroke="url(#neonPink)" strokeWidth="1.5" />
                    <ellipse cx="115" cy="175" rx="10" ry="15" stroke="url(#neonCyan)" strokeWidth="1.2" strokeDasharray="3 3" />
                  </g>

                  {/* Glowing core particles */}
                  <circle cx="210" cy="160" r="3" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
                  <circle cx="205" cy="182" r="2.5" fill="#ec4899" filter="drop-shadow(0 0 6px #ec4899)" />
                  <circle cx="195" cy="228" r="2" fill="#c084fc" filter="drop-shadow(0 0 5px #c084fc)" />
                </svg>
              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN: Massive Typographic Headline === */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <div>
              {/* .beyond typography with glowing pink dot */}
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white">
                  .{current.firstWord}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-pink-500 shadow-[0_0_12px_#ec4899] animate-pulse"></span>
                <span className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r ${current.gradient} bg-clip-text text-transparent`}>
                  {current.secondWord}
                </span>
              </div>
            </div>

            {/* Description & Minimalist White Accent Line */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-[2px] bg-white/80 shrink-0"></span>
                <span className="text-xs font-bold text-pink-300 uppercase tracking-widest">
                  {current.tagline}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                {current.description}
              </p>
            </div>

            {/* Quick Interactive Slide Arrows */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setActiveSlide((prev) => (prev === 0 ? 3 : prev - 1))}
                className="w-8 h-8 rounded-full border border-slate-700/80 hover:border-pink-500 text-slate-300 hover:text-white flex items-center justify-center text-xs transition"
              >
                ←
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev === 3 ? 0 : prev + 1))}
                className="w-8 h-8 rounded-full border border-slate-700/80 hover:border-pink-500 text-slate-300 hover:text-white flex items-center justify-center text-xs transition"
              >
                →
              </button>
              <span className="text-xs text-slate-500 font-semibold pl-2">
                Click arrows or bullets to switch studios
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------
            BOTTOM BAR: Create Art | Explore Now Pill | Gallery
           ---------------------------------------------------- */}
        <div className="relative z-20 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-white">
          
          {/* Left: Create Art / Prompt Trigger */}
          <button
            onClick={() => setShowPromptInput(!showPromptInput)}
            className="flex items-center space-x-2 text-slate-300 hover:text-pink-400 transition"
          >
            <Wand2 className="w-4 h-4 text-pink-400" />
            <span className="tracking-wider">Create Art</span>
          </button>

          {/* Center: Glowing White Pill Button (Explore Now) */}
          <button
            onClick={handleLaunchCurrent}
            className="px-8 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>{current.ctaText}</span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </button>

          {/* Right: Gallery with Vertical Bar */}
          <div className="flex items-center space-x-3 text-slate-300 hover:text-white cursor-pointer transition" onClick={() => onSelectStudio('images')}>
            <span className="tracking-wider">Gallery</span>
            <span className="w-[1.5px] h-5 bg-white/70"></span>
          </div>
        </div>

        {/* Expandable Quick Prompt Omnibar */}
        {showPromptInput && (
          <div className="relative z-30 mt-4 p-4 rounded-2xl bg-black/80 border border-pink-500/40 backdrop-blur-2xl space-y-3 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="যেকোনো ভিডিও বা ছবির প্রম্পট লিখুন (যেমন: 'সূর্যাস্তে প্রাচীন বাংলা গ্রাম' বা 'মহাকাশ বিজ্ঞানের ৩টি রহস্য')..."
                className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={handleLaunchCurrent}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <span>Launch</span>
                <Send className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowPromptInput(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          2. SECONDARY STUDIO MODULES & NEURAL VOICE SAMPLER
         ======================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.3)]">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>AI Creative Modules</span>
                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300">
                  (অল-ইন-ওয়ান স্টুডিও)
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                এক ক্লিকেই ভিডিও, ছবি, এআই অবতার এবং মাল্টি-এলএলএম ব্রেন পাওয়ার
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-bold text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
            <span>৪টি মূল ক্রিয়েটিভ ইঞ্জিন সক্রিয়</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Video & Auto Shorts */}
          <div
            onClick={() => onSelectStudio('videos', { subTab: 'shorts' })}
            className="group relative cursor-pointer rounded-2xl bg-gradient-to-b from-[#0f172a]/95 via-[#0c1222]/90 to-[#070b16]/95 hover:from-[#141b33] hover:to-[#0a0f1e] border border-slate-800/80 hover:border-pink-500/60 p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_12px_35px_-10px_rgba(236,72,153,0.35)] flex flex-col justify-between overflow-hidden"
          >
            {/* Top accent beam on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-indigo-500 blur-md opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300"></div>
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-indigo-600 border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-105 group-hover:rotate-[-3deg] transition-transform duration-300">
                    <Film className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(236,72,153,0.15)] group-hover:border-pink-500/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></span>
                  <span>VIRAL 9:16</span>
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:bg-gradient-to-r group-hover:from-pink-300 group-hover:via-rose-200 group-hover:to-white group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                Auto Shorts Studio
              </h3>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 mt-2 leading-relaxed transition-colors">
                স্বয়ংক্রিয় রিলস, <span className="text-pink-300/90 font-medium">বাংলা ভয়েসওভার</span> ও <span className="text-slate-200 font-medium">8K সিনেমাটিক ফুটেজ</span> সহ।
              </p>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-pink-400 group-hover:text-pink-300 transition-colors">
              <span className="tracking-wide">Open Studio</span>
              <div className="w-6 h-6 rounded-full bg-pink-500/10 group-hover:bg-pink-500 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: 8K Image Studio */}
          <div
            onClick={() => onSelectStudio('images')}
            className="group relative cursor-pointer rounded-2xl bg-gradient-to-b from-[#0f172a]/95 via-[#0c1222]/90 to-[#070b16]/95 hover:from-[#0e1d27] hover:to-[#071317] border border-slate-800/80 hover:border-emerald-500/60 p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_12px_35px_-10px_rgba(16,185,129,0.35)] flex flex-col justify-between overflow-hidden"
          >
            {/* Top accent beam on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 blur-md opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300"></div>
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-105 group-hover:rotate-[-3deg] transition-transform duration-300">
                    <ImageIcon className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>100% FREE 8K</span>
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:bg-gradient-to-r group-hover:from-emerald-300 group-hover:via-teal-200 group-hover:to-white group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                8K Image Studio
              </h3>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 mt-2 leading-relaxed transition-colors">
                <span className="text-emerald-300/90 font-medium">FLUX.1 ফটোরিয়ালিস্টিক</span>, ৩D রেন্ডার ও অ্যানিমে স্টাইল আর্টওয়ার্ক।
              </p>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
              <span className="tracking-wide">Open Studio</span>
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: Talking Avatar */}
          <div
            onClick={() => onSelectStudio('videos', { subTab: 'avatar' })}
            className="group relative cursor-pointer rounded-2xl bg-gradient-to-b from-[#0f172a]/95 via-[#0c1222]/90 to-[#070b16]/95 hover:from-[#1b122f] hover:to-[#0c0819] border border-slate-800/80 hover:border-purple-500/60 p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_12px_35px_-10px_rgba(168,85,247,0.35)] flex flex-col justify-between overflow-hidden"
          >
            {/* Top accent beam on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 blur-md opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300"></div>
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-pink-600 border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-105 group-hover:rotate-[-3deg] transition-transform duration-300">
                    <UserCheck className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.15)] group-hover:border-purple-500/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                  <span>LIP-SYNC AI</span>
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:via-pink-200 group-hover:to-white group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                Talking Avatar Studio
              </h3>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 mt-2 leading-relaxed transition-colors">
                স্থির ছবি থেকে <span className="text-purple-300/90 font-medium">নিখুঁত লিপ-সিঙ্ক</span> সহ জীবন্ত কথা বলানো ভিডিও।
              </p>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
              <span className="tracking-wide">Open Studio</span>
              <div className="w-6 h-6 rounded-full bg-purple-500/10 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 4: Multi-AI Chat */}
          <div
            onClick={() => onSelectStudio('chat')}
            className="group relative cursor-pointer rounded-2xl bg-gradient-to-b from-[#0f172a]/95 via-[#0c1222]/90 to-[#070b16]/95 hover:from-[#101b33] hover:to-[#070e1e] border border-slate-800/80 hover:border-cyan-500/60 p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_12px_35px_-10px_rgba(6,182,212,0.35)] flex flex-col justify-between overflow-hidden"
          >
            {/* Top accent beam on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 blur-md opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300"></div>
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-105 group-hover:rotate-[-3deg] transition-transform duration-300">
                    <MessageSquare className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)] group-hover:border-cyan-500/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>MULTI-LLM</span>
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:via-blue-200 group-hover:to-white group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                Multi-AI Chat Hub
              </h3>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 mt-2 leading-relaxed transition-colors">
                <span className="text-cyan-300/90 font-medium">GPT-4o, Claude 3.5</span> ও <span className="text-blue-300/90 font-medium">DeepSeek-R1</span> দিয়ে গভীর ক্রিয়েটিভ রিসার্চ।
              </p>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
              <span className="tracking-wide">Open Studio</span>
              <div className="w-6 h-6 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SLEEK NEURAL VOICEOVER SAMPLER
         ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0d1428]/95 via-[#090e1c]/95 to-[#050811] border border-slate-800/80 p-5 sm:p-7 shadow-2xl">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Neural Voiceover Sampler
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  Natural AI TTS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ক্লিক করে সরাসরি বাংলা ও ইংরেজি প্রাকৃতিক কণ্ঠের জীবন্ত অডিও নমুনা শুনুন
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTTSOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-bold text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-cyan-500/10"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Voiceover Studio</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { id: 'bn-pradeep', name: 'প্রদীপ (Pradeep)', lang: 'বাংলা', tone: 'পুরুষ • স্পষ্ট ও উদ্যমী' },
            { id: 'bn-nabanita', name: 'নবনিতা (Nabanita)', lang: 'বাংলা', tone: 'নারী • গল্প ও আবেগপ্রবণ' },
            { id: 'en-christopher', name: 'Christopher', lang: 'English', tone: 'Male • Deep Cinematic' },
            { id: 'en-jenny', name: 'Jenny', lang: 'English', tone: 'Female • Modern & Friendly' },
          ].map((v) => {
            const isPlaying = playingVoice === v.id;
            return (
              <div
                key={v.id}
                className={`group relative p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isPlaying
                    ? 'bg-gradient-to-b from-[#141b38] to-[#0a1024] border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.25)] scale-[1.02]'
                    : 'bg-[#0b1021]/80 hover:bg-[#101730]/90 border-slate-800/80 hover:border-slate-700/90 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/60 text-slate-300 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${v.lang === 'বাংলা' ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
                      {v.lang}
                    </span>
                    {isPlaying && (
                      <div className="flex items-end gap-0.5 h-3 px-1.5 py-0.5 rounded bg-cyan-500/10">
                        <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                        <span className="w-1 h-3.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        <span className="w-1 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                    {v.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {v.tone}
                  </div>
                </div>

                <button
                  onClick={() => handleVoicePlay(v.id)}
                  className={`w-full mt-3.5 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow ${
                    isPlaying
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:brightness-110'
                      : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700/60 hover:border-cyan-500/40'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>Play Sample</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modals for Quick TTS and STT */}
      <QuickTTSModal isOpen={isTTSOpen} onClose={() => setIsTTSOpen(false)} />
      <QuickVoiceToTextModal isOpen={isSTTOpen} onClose={() => setIsSTTOpen(false)} />
    </div>
  );
};
