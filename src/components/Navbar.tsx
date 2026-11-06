'use client';

import React from 'react';
import { Film, Sparkles, Key, Video, Wand2, UserCheck, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 't2v' | 'i2v' | 'shorts' | 'avatar';
  setActiveTab: (tab: 't2v' | 'i2v' | 'shorts' | 'avatar') => void;
  onOpenSettings: () => void;
  hasGeminiKey: boolean;
  hasFalKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  hasGeminiKey,
  hasFalKey,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0b0f19]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent flex items-center gap-2">
              AI Video Studio <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">Pro</span>
            </h1>
            <p className="text-xs text-slate-400">Text, Image & Shorts Video Generator</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-sm">
          <button
            onClick={() => setActiveTab('t2v')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 't2v'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Text-to-Video</span>
          </button>

          <button
            onClick={() => setActiveTab('i2v')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'i2v'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Image-to-Video</span>
          </button>

          <button
            onClick={() => setActiveTab('shorts')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'shorts'
                ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Auto Shorts / Reels</span>
          </button>

          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'avatar'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Talking Face Avatar</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
          >
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span>API Keys</span>
            {(hasGeminiKey || hasFalKey) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
