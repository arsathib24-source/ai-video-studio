'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, MainNavTab } from '@/components/Sidebar';
import { TextToVideoStudio } from '@/components/TextToVideoStudio';
import { ImageToVideoStudio } from '@/components/ImageToVideoStudio';
import { AutoShortsStudio } from '@/components/AutoShortsStudio';
import { TalkingAvatarStudio } from '@/components/TalkingAvatarStudio';
import { MultiAIChatStudio } from '@/components/MultiAIChatStudio';
import { ImageStudio } from '@/components/ImageStudio';
import { NotebookStudio } from '@/components/NotebookStudio';
import { AgentStudio } from '@/components/AgentStudio';
import { HomeLaunchpad } from '@/components/HomeLaunchpad';
import { WelcomeOnboarding } from '@/components/WelcomeOnboarding';
import { SettingsModal } from '@/components/SettingsModal';
import { Film, Video, Layers, UserCheck, Menu, X, Sparkles, Zap, Flame } from 'lucide-react';

export default function HomePage() {
  const [mainTab, setMainTab] = useState<MainNavTab>('home');
  const [videoSubTab, setVideoSubTab] = useState<'shorts' | 't2v' | 'i2v' | 'avatar'>('shorts');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // API Keys
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [falKey, setFalKey] = useState('');
  const [replicateKey, setReplicateKey] = useState('');
  const [pexelsKey, setPexelsKey] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedGemini = localStorage.getItem('user_gemini_key') || '';
      const storedOpenAI = localStorage.getItem('user_openai_key') || '';
      const storedClaude = localStorage.getItem('user_claude_key') || '';
      const storedDeepseek = localStorage.getItem('user_deepseek_key') || '';
      const storedFal = localStorage.getItem('user_fal_key') || '';
      const storedReplicate = localStorage.getItem('user_replicate_key') || '';
      const storedPexels = localStorage.getItem('user_pexels_key') || '';
      const storedSidebar = localStorage.getItem('sidebar_collapsed');

      setGeminiKey(storedGemini);
      setOpenaiKey(storedOpenAI);
      setClaudeKey(storedClaude);
      setDeepseekKey(storedDeepseek);
      setFalKey(storedFal);
      setReplicateKey(storedReplicate);
      setPexelsKey(storedPexels);
      if (storedSidebar !== null) {
        setIsSidebarCollapsed(storedSidebar === 'true');
      }

      // Check server env config
      fetch('/api/config')
        .then((res) => res.json())
        .then((data) => {
          if (data.geminiConfigured && !storedGemini) setGeminiKey('server_configured');
          if (data.falConfigured && !storedFal) setFalKey('server_configured');
          if (data.replicateConfigured && !storedReplicate) setReplicateKey('server_configured');
        })
        .catch(() => {});
    }
  }, []);

  const handleSaveKeys = (keys: {
    geminiKey: string;
    openaiKey?: string;
    claudeKey?: string;
    deepseekKey?: string;
    falKey: string;
    replicateKey: string;
    pexelsKey?: string;
  }) => {
    setGeminiKey(keys.geminiKey);
    if (keys.openaiKey !== undefined) setOpenaiKey(keys.openaiKey);
    if (keys.claudeKey !== undefined) setClaudeKey(keys.claudeKey);
    if (keys.deepseekKey !== undefined) setDeepseekKey(keys.deepseekKey);
    setFalKey(keys.falKey);
    setReplicateKey(keys.replicateKey);
    if (keys.pexelsKey !== undefined) setPexelsKey(keys.pexelsKey);
  };

  const handleToggleSidebar = () => {
    const next = !isSidebarCollapsed;
    setIsSidebarCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', String(next));
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col lg:flex-row relative selection:bg-purple-500 selection:text-white w-full overflow-x-hidden">
      {/* Top Ambient Glow / Aurora Lights */}
      <div className="pointer-events-none fixed top-0 left-1/3 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent blur-3xl -z-10 rounded-full"></div>
      <div className="pointer-events-none fixed top-20 right-10 w-[500px] h-[300px] bg-gradient-to-br from-pink-600/10 via-cyan-600/10 to-transparent blur-3xl -z-10 rounded-full"></div>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800/80 bg-[#090d18]/90 backdrop-blur-md sticky top-0 z-50">
        <div
          onClick={() => {
            setMainTab('home');
            setShowWelcome(false);
          }}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow">
            <span className="text-xs font-black text-white">Ai</span>
          </div>
          <h1 className="text-base font-extrabold bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            AI Tools
          </h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <div
        className={`${
          mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden'
        } lg:flex shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <Sidebar
          activeTab={mainTab}
          setActiveTab={(tab) => {
            setMainTab(tab);
            setShowWelcome(false);
            setMobileMenuOpen(false);
          }}
          onOpenSettings={() => {
            setIsSettingsOpen(true);
            setMobileMenuOpen(false);
          }}
          hasGeminiKey={!!geminiKey}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
      </div>

      {/* Main Studio Viewport (Fluid & Never cut off) */}
      <main className="flex-1 min-w-0 w-full p-3 sm:p-5 lg:p-7 space-y-6 relative overflow-x-hidden overflow-y-auto transition-all duration-300">
        <div className="w-full max-w-6xl mx-auto space-y-6 min-w-0">
          {/* Sub-Tabs specifically for Video Studio */}
          {mainTab === 'videos' && !showWelcome && (
            <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 text-pink-400" />
                    Video Generation Suite
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  AI Video & Shorts Studio
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  রিয়েল হিউম্যান ভয়েস, 4K সিনেমাটিক ব্যাকগ্রাউন্ড ফুটেজ ও অটোমেটিক এআই রিল মেকার
                </p>
              </div>

              {/* Video Sub-Navigation Tabs */}
              <div className="flex items-center p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs shadow-inner">
                <button
                  onClick={() => setVideoSubTab('shorts')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    videoSubTab === 'shorts'
                      ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white shadow-lg shadow-pink-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Auto Shorts (9:16)</span>
                </button>

                <button
                  onClick={() => setVideoSubTab('t2v')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    videoSubTab === 't2v'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Text-to-Video</span>
                </button>

                <button
                  onClick={() => setVideoSubTab('i2v')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    videoSubTab === 'i2v'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Image-to-Video</span>
                </button>

                <button
                  onClick={() => setVideoSubTab('avatar')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    videoSubTab === 'avatar'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Talking Avatar</span>
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Studio Component Rendering */}
          <div className="transition-all duration-300 min-w-0">
            {/* Optional Screen 1: Welcome Onboarding Splash */}
            {showWelcome ? (
              <WelcomeOnboarding
                onGetStarted={() => {
                  setShowWelcome(false);
                  setMainTab('home');
                }}
                onSignIn={() => {
                  setShowWelcome(false);
                  setIsSettingsOpen(true);
                }}
              />
            ) : (
              <>
                {/* Screen 2: Home Dashboard Launchpad */}
                {mainTab === 'home' && (
                  <HomeLaunchpad
                    onSelectStudio={(tab) => setMainTab(tab)}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onToggleMobileMenu={() => setMobileMenuOpen(true)}
                    onOpenWelcome={() => setShowWelcome(true)}
                  />
                )}

                {/* 1. Video Studio */}
                {mainTab === 'videos' && (
                  <>
                    {videoSubTab === 'shorts' && (
                      <AutoShortsStudio
                        geminiKey={geminiKey}
                        falKey={falKey}
                        pexelsKey={pexelsKey}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                      />
                    )}
                    {videoSubTab === 't2v' && (
                      <TextToVideoStudio
                        geminiKey={geminiKey}
                        falKey={falKey}
                        replicateKey={replicateKey}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                      />
                    )}
                    {videoSubTab === 'i2v' && (
                      <ImageToVideoStudio
                        falKey={falKey}
                        replicateKey={replicateKey}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                      />
                    )}
                    {videoSubTab === 'avatar' && (
                      <TalkingAvatarStudio
                        falKey={falKey}
                        replicateKey={replicateKey}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                      />
                    )}
                  </>
                )}

                {/* Screen 3: Image Studio */}
                {mainTab === 'images' && (
                  <ImageStudio
                    geminiKey={geminiKey}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onBack={() => setMainTab('home')}
                  />
                )}

                {/* 3. Multi-AI Chat */}
                {mainTab === 'chat' && (
                  <MultiAIChatStudio
                    geminiKey={geminiKey}
                    openaiKey={openaiKey}
                    claudeKey={claudeKey}
                    deepseekKey={deepseekKey}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                  />
                )}

                {/* 4. NotebookLM Studio */}
                {mainTab === 'notebook' && (
                  <NotebookStudio
                    geminiKey={geminiKey}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                  />
                )}

                {/* 5. AI Agents Hub */}
                {mainTab === 'agents' && (
                  <AgentStudio
                    geminiKey={geminiKey}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveKeys}
      />
    </div>
  );
}
