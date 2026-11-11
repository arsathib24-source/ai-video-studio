'use client';

import React, { useState, useEffect } from 'react';
import { MainNavTab } from './Sidebar';
import {
  Search,
  SlidersHorizontal,
  Bell,
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
  Layers,
  BookOpen,
  Bot,
  Compass,
  CheckCircle2,
  Activity,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'media' | 'content' | 'voice' | 'agents'>('all');
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'tools' | 'history' | 'saved'>('home');
  const [isTTSOpen, setIsTTSOpen] = useState(false);
  const [isSTTOpen, setIsSTTOpen] = useState(false);

  // Creative Omnibar Prompt state
  const [omnibarPrompt, setOmnibarPrompt] = useState('');
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Voice Sampler State
  const [activePlayingVoice, setActivePlayingVoice] = useState<string | null>(null);

  // Dynamic Greeting based on client time
  const [greeting, setGreeting] = useState('Assalamu Alaikum');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('শুভ সকাল, Assalamu Alaikum');
    else if (hour < 17) setGreeting('শুভ দুপুর, Assalamu Alaikum');
    else setGreeting('শুভ সন্ধ্যা, Assalamu Alaikum');
  }, []);

  // Quick Prompt Chips for Omnibar
  const quickPrompts = [
    { label: '🎬 ব্ল্যাকহোলের অজানা ৫টি তথ্য', studio: 'videos' as MainNavTab, subTab: 'shorts' as const, prompt: 'রহস্যময় ব্ল্যাকহোলের অজানা ৫টি বিস্ময়কর তথ্য' },
    { label: '🌅 শান্ত গ্রামীণ বাংলা সূর্যাস্ত ৮K', studio: 'images' as MainNavTab, prompt: 'A serene traditional Bangladeshi village during golden sunset, river reflection, lush greenery, realistic 8k' },
    { label: '🚀 Cyberpunk Dhaka 2099', studio: 'images' as MainNavTab, prompt: 'Futuristic Cyberpunk Dhaka city 2099, neon holographic signs, flying cars, rain reflection, cinematic 8k' },
    { label: '📱 Viral Motivation Reel', studio: 'videos' as MainNavTab, subTab: 'shorts' as const, prompt: 'সফল হওয়ার ৩টি গোপন বৈজ্ঞানিক মানসিক সূত্র যা জীবন বদলে দেবে' },
    { label: '🗣️ AI News Anchor Avatar', studio: 'videos' as MainNavTab, subTab: 'avatar' as const, prompt: 'স্বাগতম আজকের প্রধান প্রযুক্তি সংবাদে, AI এখন নতুন বিপ্লব সৃষ্টি করেছে।' },
    { label: '🧠 DeepSeek Reasoning Hub', studio: 'chat' as MainNavTab, prompt: 'Explain quantum computing in simple Bengali with practical analogies' },
  ];

  // 8 Comprehensive Studio Tools with rich badges and descriptions
  const tools = [
    {
      id: 'videos',
      type: 'studio',
      targetTab: 'videos' as MainNavTab,
      subTab: 'shorts' as const,
      category: 'media',
      title: 'Video & Auto Shorts',
      subtitle: 'Viral 9:16 Reels & Shorts',
      desktopDesc: 'স্বয়ংক্রিয় বাংলা ভয়েসওভার, ডায়নামিক সাবটাইটেল এবং ৪K ফুটেজ সহ ১-ক্লিকে রেডি-টু-পোস্ট ৯:১৬ রিলস তৈরি।',
      icon: Film,
      iconBg: 'bg-gradient-to-tr from-rose-600 to-pink-500',
      iconColor: 'text-white',
      badge: 'Viral Auto 9:16',
      badgeColor: 'border-rose-500/30 text-rose-300 bg-rose-500/10',
      popular: true,
    },
    {
      id: 'images',
      type: 'studio',
      targetTab: 'images' as MainNavTab,
      category: 'media',
      title: '8K Image Generator',
      subtitle: 'FLUX.1 Photorealistic AI',
      desktopDesc: 'FLUX.1 মডেল দিয়ে যেকোনো প্রম্পট থেকে আল্ট্রা-ডিটেইলড ফটোরিয়ালিস্টিক, ৩D রেন্ডার, কার্টুন ও অ্যানিমে ছবি।',
      icon: ImageIcon,
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
      iconColor: 'text-white',
      badge: '100% Free 8K',
      badgeColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
      popular: true,
    },
    {
      id: 'avatar',
      type: 'studio',
      targetTab: 'videos' as MainNavTab,
      subTab: 'avatar' as const,
      category: 'media',
      title: 'Talking Avatar Studio',
      subtitle: 'Photo & Voice Lip-Sync',
      desktopDesc: 'মানুষের যেকোনো ছবি ও অডিও/স্ক্রিপ্ট আপলোড করে নিখুঁত লিপ-সিঙ্ক সহ জীবন্ত উপস্থাপক ভিডিও জেনারেশন।',
      icon: UserCheck,
      iconBg: 'bg-gradient-to-tr from-purple-600 to-indigo-500',
      iconColor: 'text-white',
      badge: 'Real Lip-Sync',
      badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
      popular: true,
    },
    {
      id: 'chat',
      type: 'studio',
      targetTab: 'chat' as MainNavTab,
      category: 'content',
      title: 'Multi-AI Reasoning Hub',
      subtitle: 'GPT-4o, Claude & DeepSeek',
      desktopDesc: 'Gemini 2.0 Flash, DeepSeek-R1, Claude 3.5 Sonnet এবং ChatGPT-4o দিয়ে যেকোনো জটিল প্রশ্ন ও কোডিং সমাধান।',
      icon: MessageSquare,
      iconBg: 'bg-gradient-to-tr from-indigo-600 to-blue-500',
      iconColor: 'text-white',
      badge: 'Multi-LLM 2.0',
      badgeColor: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10',
      popular: true,
    },
    {
      id: 'tts',
      type: 'modal',
      category: 'voice',
      title: 'Neural Text-to-Speech',
      subtitle: 'Bangla & English Voices',
      desktopDesc: 'প্রদীপ ও নবনিতা সহ প্রাকৃতিক বাংলা এবং ক্রিস্টোফার ও জেনির স্টুডিও-কোয়ালিটি আল্ট্রা-ন্যাচারাল ভয়েস সিন্থেসিস।',
      icon: Volume2,
      iconBg: 'bg-gradient-to-tr from-blue-600 to-cyan-500',
      iconColor: 'text-white',
      badge: 'Neural Voice',
      badgeColor: 'border-blue-500/30 text-blue-300 bg-blue-500/10',
      popular: false,
    },
    {
      id: 'stt',
      type: 'modal',
      category: 'voice',
      title: 'Live Voice-to-Text',
      subtitle: 'Microphone Transcription',
      desktopDesc: 'লাইভ মাইক্রোফোন স্পিচ রিকগনিশন—মুখে কথা বললেই সরাসরি নির্ভুল বাংলা ও ইংরেজি টেক্সটে রূপান্তরিত হবে।',
      icon: Mic,
      iconBg: 'bg-gradient-to-tr from-amber-600 to-orange-500',
      iconColor: 'text-white',
      badge: 'Speech to Text',
      badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
      popular: false,
    },
    {
      id: 'agents',
      type: 'studio',
      targetTab: 'agents' as MainNavTab,
      category: 'agents',
      title: 'Autonomous AI Agents',
      subtitle: 'Self-Driving Agents',
      desktopDesc: 'কাস্টম এআই এজেন্ট তৈরি করুন যা নিজে নিজে ইন্টারনেট রিসার্চ, কন্টেন্ট প্ল্যানিং ও টাস্ক এক্সিকিউট করে।',
      icon: Bot,
      iconBg: 'bg-gradient-to-tr from-fuchsia-600 to-purple-600',
      iconColor: 'text-white',
      badge: 'Auto Agent',
      badgeColor: 'border-fuchsia-500/30 text-fuchsia-300 bg-fuchsia-500/10',
      popular: false,
    },
    {
      id: 'notebook',
      type: 'studio',
      targetTab: 'notebook' as MainNavTab,
      category: 'content',
      title: 'Smart Research Notebook',
      subtitle: 'Document & PDF Intelligence',
      desktopDesc: 'বই, নোট ও আর্টিকেল আপলোড করে পুরো বিষয়ের সারসংক্ষেপ, পয়েন্টভিত্তিক নোট এবং অটো অডিও পডকাস্ট তৈরি।',
      icon: BookOpen,
      iconBg: 'bg-gradient-to-tr from-violet-600 to-slate-700',
      iconColor: 'text-white',
      badge: 'Document AI',
      badgeColor: 'border-violet-500/30 text-violet-300 bg-violet-500/10',
      popular: false,
    },
  ];

  // Voice Sampler Data
  const sampleVoices = [
    {
      id: 'bn-BD-PradeepNeural',
      name: 'Pradeep Neural',
      lang: 'বাংলা (বাংলাদেশ)',
      gender: 'পুরুষ (স্পষ্ট ও উদ্যমী কণ্ঠ)',
      tag: 'Viral Reels',
      sampleText: 'আসসালামু আলাইকুম, AI ভিডিও স্টুডিওতে স্বাগতম। যেকোনো বিষয়ের আকর্ষণীয় রিলস এখন মুহূর্তেই তৈরি করুন।',
    },
    {
      id: 'bn-BD-NabanitaNeural',
      name: 'Nabanita Neural',
      lang: 'বাংলা (বাংলাদেশ)',
      gender: 'নারী (গল্প ও ডকুমেন্টারি)',
      tag: 'Storytelling',
      sampleText: 'আজকের এই বিশেষ পর্বে আমরা আলোচনা করব ভবিষ্যতের সবচেয়ে চমকপ্রদ কৃত্রিম বুদ্ধিমত্তা নিয়ে।',
    },
    {
      id: 'en-US-ChristopherNeural',
      name: 'Christopher',
      lang: 'English (US/UK)',
      gender: 'Male (Deep Cinematic)',
      tag: 'Cinematic Voice',
      sampleText: 'Deep inside the cosmos, mysterious celestial bodies defy our understanding of modern physics.',
    },
    {
      id: 'en-US-JennyNeural',
      name: 'Jenny',
      lang: 'English (US)',
      gender: 'Female (Friendly & Modern)',
      tag: 'Podcast / Promo',
      sampleText: 'Welcome back to our daily tech show! Today we are looking at revolutionary generative video systems.',
    },
  ];

  // Voice player test handler using browser SpeechSynthesis or simulated waveform
  const handlePlayVoiceSample = (voice: typeof sampleVoices[0]) => {
    if (activePlayingVoice === voice.id) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setActivePlayingVoice(null);
      return;
    }

    setActivePlayingVoice(voice.id);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voice.sampleText);
      utterance.rate = 1.0;
      utterance.onend = () => setActivePlayingVoice(null);
      utterance.onerror = () => setActivePlayingVoice(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setActivePlayingVoice(null), 4000);
    }
  };

  const handleToolClick = (tool: (typeof tools)[0]) => {
    if (tool.id === 'tts') {
      setIsTTSOpen(true);
    } else if (tool.id === 'stt') {
      setIsSTTOpen(true);
    } else if (tool.targetTab) {
      onSelectStudio(tool.targetTab, { subTab: tool.subTab });
    }
  };

  const handleExecuteOmnibar = (target: 'images' | 'videos' | 'chat') => {
    const promptToSend = omnibarPrompt.trim();
    if (target === 'videos') {
      onSelectStudio('videos', { prompt: promptToSend, subTab: 'shorts' });
    } else if (target === 'images') {
      onSelectStudio('images', { prompt: promptToSend });
    } else {
      onSelectStudio('chat', { prompt: promptToSend });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyToast(`${label} কপি হয়েছে!`);
      setTimeout(() => setCopyToast(null), 2500);
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desktopDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-7 pb-24 lg:pb-12 animate-in fade-in duration-300 select-none min-w-0">
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* ========================================================
          1. TOP APP HEADER (Adaptive Mobile & Desktop)
         ======================================================== */}
      {/* Mobile Top Header */}
      <div className="flex lg:hidden items-center justify-between pt-1">
        <button
          onClick={onToggleMobileMenu || onOpenSettings}
          className="p-2.5 rounded-2xl bg-[#0b101e] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition shadow"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={onOpenWelcome}
          className="flex items-center space-x-2 cursor-pointer group"
          title="Click to view Welcome Splash"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md group-hover:scale-105 transition">
            <div className="w-full h-full rounded-xl bg-[#0b101d] flex items-center justify-center">
              <span className="text-xs font-black bg-gradient-to-r from-white via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                Ai
              </span>
            </div>
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">
            AI Studio
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl bg-[#0b101e] border border-slate-800 text-slate-300 hover:text-white transition shadow relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500"></span>
          </button>

          <div
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow cursor-pointer"
          >
            <div className="w-full h-full rounded-2xl bg-[#141b2d] flex items-center justify-center text-xs font-bold text-white">
              AR
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Landscape Header with Live Telemetry Pulse */}
      <div className="hidden lg:flex items-center justify-between gap-4 pb-3 border-b border-slate-800/60 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Super AI Creative Studio</span>
            </span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All 6 AI Engines Operational
            </span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-[11px] text-indigo-300/80 font-medium">
              Ultra Low Latency (1.2s)
            </span>
          </div>

          <h1 className="text-2xl xl:text-3xl font-black text-white leading-tight tracking-tight">
            {greeting},{' '}
            <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-300 bg-clip-text text-transparent">
              Anisur Rahman 👋
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            সিনেমাটিক ভিডিও, ৮K ফটোরিয়ালিজম, রিয়েল হিউম্যান ভয়েস এবং মাল্টি-মডেল এআই হাব এক জায়গায়
          </p>
        </div>

        {/* Desktop Quick Search & Profile */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="relative w-52 xl:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI modules (or type /)..."
              className="w-full pl-9 pr-8 py-2 bg-[#0b101d] border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-[#0b101e] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition shadow relative group"
            title="Settings & API Keys"
          >
            <Bell className="w-4 h-4 group-hover:rotate-12 transition duration-200" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500"></span>
          </button>

          <div
            onClick={onOpenSettings}
            className="flex items-center space-x-2.5 p-1 pr-3 rounded-xl bg-[#0b101e] border border-slate-800 hover:border-purple-500/40 cursor-pointer transition shadow group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow group-hover:scale-105 transition">
              <div className="w-full h-full rounded-lg bg-[#141b2d] flex items-center justify-center text-xs font-bold text-white">
                AR
              </div>
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition">Anisur Rahman</div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Pro Studio Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. HIGH-TECH DYNAMIC CREATIVE OMNIBAR & HERO SECTION
         ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#101426] via-[#0d1020] to-[#080b15] border border-purple-500/30 p-5 sm:p-7 lg:p-8 shadow-2xl space-y-6">
        {/* Ambient Aurora Glow Background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-600/20 via-pink-600/15 to-transparent blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-gradient-to-tr from-indigo-600/20 via-blue-600/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>

        {/* Hero Headline & Badges */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-200 text-xs font-extrabold tracking-wide">
              <Flame className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
              <span>All-In-One Generative AI Studio • 2026 Edition</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Create Anything with AI{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Instantly ✨
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              যেকোনো প্রম্পট লিখুন অথবা নিচের শর্টকাট ক্লিক করে সরাসরি সিনেমাটিক ভিডিও রিল, ৮K ইমেজ অথবা মাল্টি-মডেল চ্যাটে প্রবেশ করুন।
            </p>
          </div>

          {/* Quick Metrics Badge Showcase */}
          <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
            <div className="px-3.5 py-2.5 rounded-2xl bg-[#090d19]/80 border border-slate-800/90 text-center shadow">
              <div className="text-xs font-black text-purple-400">FLUX.1 & Gemini</div>
              <div className="text-[10px] text-slate-400 font-semibold">100% Free Tier</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-2xl bg-[#090d19]/80 border border-slate-800/90 text-center shadow">
              <div className="text-xs font-black text-emerald-400">9:16 & 4K</div>
              <div className="text-[10px] text-slate-400 font-semibold">Viral Ready</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-2xl bg-[#090d19]/80 border border-slate-800/90 text-center shadow">
              <div className="text-xs font-black text-cyan-400">DeepSeek-R1</div>
              <div className="text-[10px] text-slate-400 font-semibold">Reasoning AI</div>
            </div>
          </div>
        </div>

        {/* Dynamic Creative Omnibar (Real Interactive Prompt Launcher) */}
        <div className="relative z-10 space-y-3">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-[#060912]/90 border border-purple-500/40 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/30 transition shadow-2xl">
            <div className="flex items-center flex-1 px-3 py-1">
              <Wand2 className="w-5 h-5 text-purple-400 shrink-0 mr-3 animate-pulse" />
              <input
                type="text"
                value={omnibarPrompt}
                onChange={(e) => setOmnibarPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && omnibarPrompt.trim()) {
                    handleExecuteOmnibar('images');
                  }
                }}
                placeholder="একটি ধারণা লিখুন (যেমন: 'সূর্যাস্তে প্রাচীন বাংলা গ্রাম' বা 'মহাকাশ বিজ্ঞানের ৩টি রহস্য')..."
                className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none py-2"
              />
              {omnibarPrompt && (
                <button
                  onClick={() => setOmnibarPrompt('')}
                  className="text-slate-400 hover:text-white text-xs px-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Multi-Studio Trigger Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 px-1 pb-1 sm:pb-0">
              <button
                onClick={() => handleExecuteOmnibar('images')}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition active:scale-95"
                title="Create 8K Image from this prompt"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Create Image</span>
              </button>

              <button
                onClick={() => handleExecuteOmnibar('videos')}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-pink-600/25 transition active:scale-95"
                title="Create 9:16 Video Shorts from this prompt"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Make Shorts (9:16)</span>
              </button>

              <button
                onClick={() => handleExecuteOmnibar('chat')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition"
                title="Ask AI Chat"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Clickable Inspiration Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Quick Ideas:</span>
            </span>
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setOmnibarPrompt(item.prompt);
                  onSelectStudio(item.studio, { prompt: item.prompt, subTab: item.subTab });
                }}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-purple-950/80 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3 h-3 text-purple-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          3. CATEGORY FILTER NAVIGATION PILLS
         ======================================================== */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none min-w-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#0b101e] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Creative Modules ({tools.length})
          </button>

          <button
            onClick={() => setActiveCategory('media')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
              activeCategory === 'media'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#0b101e] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video & Visual Studio</span>
          </button>

          <button
            onClick={() => setActiveCategory('voice')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
              activeCategory === 'voice'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#0b101e] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Neural Voice & Audio</span>
          </button>

          <button
            onClick={() => setActiveCategory('content')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
              activeCategory === 'content'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#0b101e] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Multi-LLM & Chat</span>
          </button>

          <button
            onClick={() => setActiveCategory('agents')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
              activeCategory === 'agents'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#0b101e] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Autonomous Agents</span>
          </button>
        </div>

        <span className="hidden lg:block text-xs text-slate-500 font-semibold shrink-0">
          Showing {filteredTools.length} modules ready
        </span>
      </div>

      {/* ========================================================
          4. DYNAMIC TOOL CARDS GRID (Modern Elevated Cards)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 min-w-0">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="group cursor-pointer rounded-2xl bg-[#0b101e]/90 hover:bg-[#121930] border border-slate-800/80 hover:border-purple-500/60 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between relative overflow-hidden min-w-0"
            >
              {/* Dynamic top gradient bar on card hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-400/80 transition duration-300"></div>

              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-11 h-11 rounded-2xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition duration-300`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                </div>

                {/* Title & Descriptions */}
                <div className="pt-3.5">
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-purple-300 transition truncate">
                    {tool.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-purple-400/90 mt-0.5 truncate">
                    {tool.subtitle}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {tool.desktopDesc}
                  </p>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 group-hover:text-purple-400 transition flex items-center gap-1">
                  <span>Open Studio</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </span>

                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-purple-400 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.9)] transition"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          5. INTERACTIVE LIVE NEURAL VOICEOVER SAMPLER
         ======================================================== */}
      <div className="rounded-3xl bg-[#090d1a] border border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-bold">
              <Volume2 className="w-3 h-3 text-cyan-400" />
              <span>Interactive Audio Synthesizer</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              Neural Voiceover Showcase (বাংলা ও ইংরেজি কণ্ঠ)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              প্লে বাটনে ক্লিক করে সরাসরি কণ্ঠের নমুনা শুনুন এবং আপনার ভিডিওর জন্য পারফেক্ট ভয়েস বেছে নিন
            </p>
          </div>

          <button
            onClick={() => setIsTTSOpen(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Generate Full Voiceover</span>
          </button>
        </div>

        {/* 4 Voice Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleVoices.map((voice) => {
            const isPlaying = activePlayingVoice === voice.id;
            return (
              <div
                key={voice.id}
                className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                  isPlaying
                    ? 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-500/10'
                    : 'bg-[#0d1222] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                    {voice.tag}
                  </span>
                  <span className="text-[10px] text-slate-400">{voice.lang}</span>
                </div>

                <div className="text-sm font-extrabold text-white truncate">{voice.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{voice.gender}</div>

                {/* Animated Equalizer Wave when playing */}
                <div className="h-6 my-2.5 flex items-center justify-center gap-1">
                  {isPlaying ? (
                    <>
                      <span className="w-1 h-3 bg-blue-400 rounded-full animate-bounce"></span>
                      <span className="w-1 h-5 bg-cyan-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1 h-6 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                      <span className="w-1 h-4 bg-purple-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                    </>
                  ) : (
                    <div className="w-full h-1 bg-slate-800 rounded-full"></div>
                  )}
                </div>

                <button
                  onClick={() => handlePlayVoiceSample(voice)}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isPlaying
                      ? 'bg-rose-600 text-white hover:bg-rose-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Stop Sample</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Sample</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          6. CURATED INSPIRATION & PROMPT EXPLORER GALLERY
         ======================================================== */}
      <div className="space-y-4 pt-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Prompt Inspiration Hub</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              Featured Creations & Instant Remix (100% Free FLUX.1)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              যেকোনো প্রম্পট কপি করুন অথবা <strong>Remix in Studio</strong>-তে ক্লিক করে সরাসরি নতুন ভ্যারিয়েশন তৈরি করুন
            </p>
          </div>

          <button
            onClick={() => onSelectStudio('images')}
            className="self-start sm:self-auto text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
          >
            <span>Open Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
          {MOCKUP_ASSETS.recentGenerations.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#0b101e] border border-slate-800/90 hover:border-purple-500/50 p-3.5 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between min-w-0"
            >
              <div>
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 relative shadow-inner">
                  <div
                    className="w-full h-full group-hover:scale-105 transition duration-500"
                    dangerouslySetInnerHTML={{ __html: item.svgThumb }}
                  />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-black/70 text-white backdrop-blur-md border border-white/10">
                    {item.badge}
                  </span>
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-900/80 text-purple-200 backdrop-blur-md border border-purple-500/30">
                    {item.aspectRatio}
                  </span>
                </div>

                <div className="pt-3">
                  <h4 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.prompt}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Copy Prompt & Remix */}
              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(item.prompt, item.title)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </button>

                <button
                  onClick={() => onSelectStudio('images', { prompt: item.prompt })}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Remix in Studio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          7. PRO WORKFLOW RECIPES (Fast Track Cards)
         ======================================================== */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b1122] via-[#0e162d] to-[#0b1020] border border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Pro Creator Workflows (কাজের গতি ১০ গুণ বাড়িয়ে নিন)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            সরাসরি নির্বাচিত ওয়ার্কফ্লো শুরু করে খুব দ্রুত প্রফেশনাল ফলাফল পান
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            onClick={() => onSelectStudio('videos', { subTab: 'shorts' })}
            className="p-3.5 rounded-2xl bg-[#070b16] border border-slate-800/80 hover:border-pink-500/50 cursor-pointer transition hover:-translate-y-1 group"
          >
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-2 font-black text-xs">
              01
            </div>
            <div className="text-xs font-extrabold text-white group-hover:text-pink-300 transition">
              Viral YouTube Shorts
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              টপিক দিলে Gemini স্ক্রিপ্ট লিখবে এবং FFmpeg দিয়ে রেডি-টু-পোস্ট ৯:১৬ রিল তৈরি।
            </p>
          </div>

          <div
            onClick={() => onSelectStudio('images')}
            className="p-3.5 rounded-2xl bg-[#070b16] border border-slate-800/80 hover:border-emerald-500/50 cursor-pointer transition hover:-translate-y-1 group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 font-black text-xs">
              02
            </div>
            <div className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition">
              Photorealistic 8K
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              FLUX.1 দিয়ে সোশ্যাল মিডিয়া অ্যাড ও পোস্টার বানাতে ১০০% ফটোরিয়ালিস্টিক ছবি।
            </p>
          </div>

          <div
            onClick={() => onSelectStudio('videos', { subTab: 'avatar' })}
            className="p-3.5 rounded-2xl bg-[#070b16] border border-slate-800/80 hover:border-purple-500/50 cursor-pointer transition hover:-translate-y-1 group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 font-black text-xs">
              03
            </div>
            <div className="text-xs font-extrabold text-white group-hover:text-purple-300 transition">
              Talking Avatar Video
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              নিজের ছবি বা যেকোনো ক্যারেক্টারের ছবিতে ভয়েস দিয়ে নিখুঁত কথা বলানো ভিডিও।
            </p>
          </div>

          <div
            onClick={() => onSelectStudio('chat')}
            className="p-3.5 rounded-2xl bg-[#070b16] border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition hover:-translate-y-1 group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 font-black text-xs">
              04
            </div>
            <div className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition">
              Multi-AI Deep Research
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              DeepSeek ও Claude 3.5 দিয়ে রিসার্চ, কোডিং সমস্যা এবং কন্টেন্ট আইডিয়া জেনারেশন।
            </p>
          </div>
        </div>
      </div>

      {/* Modals for Quick TTS and STT */}
      <QuickTTSModal isOpen={isTTSOpen} onClose={() => setIsTTSOpen(false)} />
      <QuickVoiceToTextModal isOpen={isSTTOpen} onClose={() => setIsSTTOpen(false)} />

      {/* ========================================================
          8. FIXED MOBILE BOTTOM NAVIGATION (Hidden on PC/Laptop Landscape: lg:hidden)
         ======================================================== */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#080d19]/95 backdrop-blur-xl border-t border-slate-800/80 py-2.5 px-6 max-w-xl mx-auto flex items-center justify-around shadow-2xl">
        {/* Home */}
        <button
          onClick={() => setActiveBottomNav('home')}
          className="flex flex-col items-center relative group py-1"
        >
          <Home
            className={`w-5 h-5 transition ${
              activeBottomNav === 'home' ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'
            }`}
          />
          <span
            className={`text-[10px] font-bold mt-1 transition ${
              activeBottomNav === 'home' ? 'text-white' : 'text-slate-500'
            }`}
          >
            Home
          </span>
          {activeBottomNav === 'home' && (
            <span className="w-4 h-1 rounded-full bg-purple-500 mt-0.5 shadow-md shadow-purple-500/50"></span>
          )}
        </button>

        {/* Tools */}
        <button
          onClick={() => {
            setActiveBottomNav('tools');
            onSelectStudio('videos');
          }}
          className="flex flex-col items-center relative group py-1"
        >
          <Grid
            className={`w-5 h-5 transition ${
              activeBottomNav === 'tools' ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'
            }`}
          />
          <span
            className={`text-[10px] font-bold mt-1 transition ${
              activeBottomNav === 'tools' ? 'text-white' : 'text-slate-500'
            }`}
          >
            Tools
          </span>
          {activeBottomNav === 'tools' && (
            <span className="w-4 h-1 rounded-full bg-purple-500 mt-0.5 shadow-md shadow-purple-500/50"></span>
          )}
        </button>

        {/* History */}
        <button
          onClick={() => {
            setActiveBottomNav('history');
            onSelectStudio('notebook');
          }}
          className="flex flex-col items-center relative group py-1"
        >
          <Clock
            className={`w-5 h-5 transition ${
              activeBottomNav === 'history' ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'
            }`}
          />
          <span
            className={`text-[10px] font-bold mt-1 transition ${
              activeBottomNav === 'history' ? 'text-white' : 'text-slate-500'
            }`}
          >
            History
          </span>
          {activeBottomNav === 'history' && (
            <span className="w-4 h-1 rounded-full bg-purple-500 mt-0.5 shadow-md shadow-purple-500/50"></span>
          )}
        </button>

        {/* Saved */}
        <button
          onClick={() => {
            setActiveBottomNav('saved');
            onOpenSettings();
          }}
          className="flex flex-col items-center relative group py-1"
        >
          <Heart
            className={`w-5 h-5 transition ${
              activeBottomNav === 'saved' ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'
            }`}
          />
          <span
            className={`text-[10px] font-bold mt-1 transition ${
              activeBottomNav === 'saved' ? 'text-white' : 'text-slate-500'
            }`}
          >
            Saved
          </span>
          {activeBottomNav === 'saved' && (
            <span className="w-4 h-1 rounded-full bg-purple-500 mt-0.5 shadow-md shadow-purple-500/50"></span>
          )}
        </button>
      </div>
    </div>
  );
};
