'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { QuickTTSModal } from './QuickTTSModal';
import { QuickVoiceToTextModal } from './QuickVoiceToTextModal';
import { MOCKUP_ASSETS } from '@/lib/mockup-assets';

interface HomeLaunchpadProps {
  onSelectStudio: (tab: MainNavTab) => void;
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'content' | 'media' | 'productivity'>('all');
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'tools' | 'history' | 'saved'>('home');
  const [isTTSOpen, setIsTTSOpen] = useState(false);
  const [isSTTOpen, setIsSTTOpen] = useState(false);

  // Exact 6 tools matching the mockup Screen 2
  const tools = [
    {
      id: 'chat' as const,
      type: 'studio',
      targetTab: 'chat' as MainNavTab,
      category: 'content',
      title: 'AI Chat',
      subtitle: 'Ask anything',
      desktopDesc: 'ChatGPT-4o, Claude 3.5 Sonnet, Gemini 2.0 & DeepSeek-R1 with deep reasoning stream.',
      icon: MessageSquare,
      iconBg: 'bg-indigo-600',
      iconColor: 'text-white',
      badge: 'Smart Multi-LLM',
    },
    {
      id: 'images' as const,
      type: 'studio',
      targetTab: 'images' as MainNavTab,
      category: 'media',
      title: 'Image Generator',
      subtitle: 'Create images from text',
      desktopDesc: 'FLUX.1 8K Photorealistic Image Studio. Multiple styles (Realistic, 3D, Cartoon, Anime).',
      icon: ImageIcon,
      iconBg: 'bg-emerald-600',
      iconColor: 'text-white',
      badge: '100% Free 8K',
    },
    {
      id: 'videos' as const,
      type: 'studio',
      targetTab: 'videos' as MainNavTab,
      category: 'media',
      title: 'Video Generator',
      subtitle: 'Text to video',
      desktopDesc: 'Auto 9:16 Shorts/Reels generator with natural Bengali voiceover, subtitles, and cinematic 4K clips.',
      icon: Film,
      iconBg: 'bg-rose-600',
      iconColor: 'text-white',
      badge: 'Viral Auto 9:16',
    },
    {
      id: 'tts' as const,
      type: 'modal',
      category: 'productivity',
      title: 'Text to Speech',
      subtitle: 'Convert text to voice',
      desktopDesc: 'Natural human neural voice synthesis with Pradeep, Nabanita, Christopher and Jenny voices.',
      icon: Volume2,
      iconBg: 'bg-blue-600',
      iconColor: 'text-white',
      badge: 'Neural Voice',
    },
    {
      id: 'stt' as const,
      type: 'modal',
      category: 'productivity',
      title: 'Voice to Text',
      subtitle: 'Transcribe audio',
      desktopDesc: 'Live microphone speech recognition and transcription into clean Bengali and English text.',
      icon: Mic,
      iconBg: 'bg-emerald-600',
      iconColor: 'text-white',
      badge: 'Live Transcribe',
    },
    {
      id: 'writer' as const,
      type: 'studio',
      targetTab: 'agents' as MainNavTab,
      category: 'content',
      title: 'AI Writer',
      subtitle: 'Blog, email, social post',
      desktopDesc: 'Autonomous Antigravity AI agents for content creation, deep research, and technical writing.',
      icon: PenTool,
      iconBg: 'bg-purple-600',
      iconColor: 'text-white',
      badge: 'Autonomous AI',
    },
  ];

  const handleToolClick = (tool: (typeof tools)[0]) => {
    if (tool.id === 'tts') {
      setIsTTSOpen(true);
    } else if (tool.id === 'stt') {
      setIsSTTOpen(true);
    } else if (tool.targetTab) {
      onSelectStudio(tool.targetTab);
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desktopDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 pb-24 lg:pb-8 animate-in fade-in duration-300 select-none min-w-0">
      {/* ========================================================
          1. HEADER SECTION (Adaptive: Mobile Header vs Desktop Landscape Header)
         ======================================================== */}
      {/* Mobile Top App Header */}
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
            AI Tools
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenSettings}
            className="relative p-2.5 rounded-2xl bg-[#0b101e] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition shadow"
            title="Settings & Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500"></span>
          </button>

          <div
            onClick={onOpenSettings}
            className="relative cursor-pointer group"
            title="Anisur Rahman (Online)"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow group-hover:scale-105 transition">
              <div className="w-full h-full rounded-2xl bg-[#141b2d] flex items-center justify-center text-xs font-bold text-white">
                AR
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#060911]"></span>
          </div>
        </div>
      </div>

      {/* Desktop Landscape Top Header (Widescreen Fluid) */}
      <div className="hidden lg:flex items-center justify-between gap-4 pb-2 border-b border-slate-800/60 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Super AI Studio Platform</span>
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
          <h1 className="text-xl xl:text-2xl font-black text-white leading-tight truncate">
            Assalamu Alaikum,{' '}
            <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              Anisur Rahman 👋
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            Explore powerful AI creative tools for your daily production and workflow
          </p>
        </div>

        {/* Desktop Quick Right Actions & Search */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="relative w-48 xl:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI tools..."
              className="w-full pl-9 pr-3 py-2 bg-[#0b101d] border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition shadow-inner"
            />
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#0b101e] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition shadow"
            title="Settings & API Keys"
          >
            <Bell className="w-4 h-4" />
          </button>

          <div
            onClick={onOpenSettings}
            className="flex items-center space-x-2 p-1 pr-2.5 rounded-xl bg-[#0b101e] border border-slate-800 hover:border-slate-700 cursor-pointer transition shadow"
            title="Account Profile"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow">
              <div className="w-full h-full rounded-lg bg-[#141b2d] flex items-center justify-center text-[11px] font-bold text-white">
                AR
              </div>
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-bold text-slate-200">Anisur Rahman</div>
              <div className="text-[9px] text-emerald-400 font-medium">Pro Creator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Greeting (hidden on desktop) */}
      <div className="space-y-1 lg:hidden">
        <h1 className="text-xl font-black text-white leading-tight">
          Assalamu Alaikum, <br />
          <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            Anisur Rahman 👋
          </span>
        </h1>
        <p className="text-xs text-slate-400">
          Explore powerful AI tools for your daily work
        </p>
      </div>

      {/* Mobile Search Bar (hidden on desktop) */}
      <div className="relative flex lg:hidden items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search AI tools..."
          className="w-full pl-11 pr-12 py-3.5 bg-[#0b101d] border border-slate-800/90 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner transition"
        />
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3.5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Filter / Clear"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================
          2. HERO FEATURED BANNER (Widescreen Landscape Fluid)
         ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-[#0b1020] border border-purple-500/30 p-5 sm:p-6 lg:p-7 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 min-w-0">
        {/* Ambient violet glow mesh */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="space-y-2.5 z-10 min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Next-Generation Studio</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
            Create Anything with AI ✨
          </h2>

          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-lg">
            ৮K ফটোরিয়ালিস্টিক ইমেজ, বাংলা ভয়েসওভার সহ অটোমেটিক ৯:১৬ রিলস/শর্টস, মাল্টি-মডেল চ্যাট এবং অটোনোমাস এআই এজেন্ট এক প্ল্যাটফর্মে।
          </p>

          <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onSelectStudio('images')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-pink-500/30 flex items-center gap-2 transition hover:scale-105 active:scale-95"
            >
              <span>Try Now (Create Image)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectStudio('videos')}
              className="px-4 py-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-bold flex items-center gap-1.5 transition hover:border-purple-500/50"
            >
              <Film className="w-3.5 h-3.5 text-pink-400" />
              <span>Make Auto Shorts (9:16)</span>
            </button>
          </div>
        </div>

        {/* 3D Glowing Showcase Graphic */}
        <div className="relative z-10 shrink-0 self-center md:self-auto flex items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
            <div className="relative w-44 h-32 lg:w-52 lg:h-36 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#0b101f] border border-indigo-400/40 shadow-2xl flex flex-col items-center justify-center p-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white mb-1.5 shadow-lg group-hover:scale-110 transition">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-pink-300">
                AI STUDIO
              </span>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400 font-semibold">
                <span>8K FLUX</span>
                <span>•</span>
                <span>60FPS</span>
                <span>•</span>
                <span className="text-emerald-400">100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. CATEGORY FILTER PILLS
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
            All Tools (6)
          </button>

          <button
            onClick={() => setActiveCategory('content')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
              activeCategory === 'content'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#0b101e] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Content & Chat</span>
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
            <span>Media (Video & Image)</span>
          </button>

          <button
            onClick={() => setActiveCategory('productivity')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
              activeCategory === 'productivity'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#0b101e] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice & Audio</span>
          </button>
        </div>

        <span className="hidden lg:block text-xs text-slate-500 font-medium shrink-0">
          Showing {filteredTools.length} creative modules
        </span>
      </div>

      {/* ========================================================
          4. TOOL GRID (Mobile: 2-Cols | PC/Laptop: 3-Cols Landscape)
         ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 min-w-0">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="group cursor-pointer rounded-2xl bg-[#0b101e]/90 hover:bg-[#11182c] border border-slate-800/80 hover:border-purple-500/50 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between relative overflow-hidden min-w-0"
            >
              {/* Top ambient highlight on card hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-500/60 transition duration-500"></div>

              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition duration-300`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300 shrink-0">
                    {tool.badge}
                  </span>
                </div>

                {/* Title & Descriptions */}
                <div className="pt-3 sm:pt-3.5">
                  <h3 className="text-xs sm:text-sm lg:text-base font-black text-white group-hover:text-purple-300 transition truncate">
                    {tool.title}
                  </h3>

                  {/* Mobile short subtitle */}
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-1 lg:hidden">
                    {tool.subtitle}
                  </p>

                  {/* Desktop detailed description */}
                  <p className="hidden lg:block text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {tool.desktopDesc}
                  </p>
                </div>
              </div>

              {/* Bottom Row on Desktop: Open Studio Action */}
              <div className="pt-3 mt-2 sm:mt-3 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-purple-400 transition flex items-center gap-1">
                  <span>Open Tool</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </span>

                <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-purple-400 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.8)] transition"></div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 text-slate-500 text-xs sm:text-sm">
          কোনো এআই টুল পাওয়া যায়নি। অন্য কিছু সার্চ করুন।
        </div>
      )}

      {/* ========================================================
          5. DESKTOP LANDSCAPE QUICK SHOWCASE SECTION
         ======================================================== */}
      <div className="hidden lg:block space-y-4 pt-4 border-t border-slate-800/70 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Featured Creations & Gallery (100% Free FLUX.1)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              যেকোনো ছবির ওপর ক্লিক করে প্রম্পট লোড করে সরাসরি নতুন ভ্যারিয়েশন তৈরি করুন
            </p>
          </div>

          <button
            onClick={() => onSelectStudio('images')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
          >
            <span>Open Image Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 min-w-0">
          {MOCKUP_ASSETS.recentGenerations.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectStudio('images')}
              className="group cursor-pointer rounded-2xl bg-[#0b101e] border border-slate-800/90 hover:border-purple-500/50 p-3 transition-all duration-300 hover:-translate-y-1 shadow-lg min-w-0"
            >
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 relative shadow-inner">
                <div
                  className="w-full h-full group-hover:scale-105 transition duration-500"
                  dangerouslySetInnerHTML={{ __html: item.svgThumb }}
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/60 text-white backdrop-blur-sm border border-white/10">
                  {item.badge}
                </span>
              </div>
              <div className="pt-2">
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {item.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals for Quick TTS and STT */}
      <QuickTTSModal isOpen={isTTSOpen} onClose={() => setIsTTSOpen(false)} />
      <QuickVoiceToTextModal isOpen={isSTTOpen} onClose={() => setIsSTTOpen(false)} />

      {/* ========================================================
          6. FIXED MOBILE BOTTOM NAVIGATION (Hidden on PC/Laptop Landscape: lg:hidden)
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
