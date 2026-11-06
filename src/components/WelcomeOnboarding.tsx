'use client';

import React from 'react';
import { Sparkles, ArrowRight, Image as ImageIcon, Film, Music, MessageSquare, Code, PenTool, CheckCircle2 } from 'lucide-react';
import { MOCKUP_ASSETS } from '@/lib/mockup-assets';

interface WelcomeOnboardingProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-between py-6 px-4 max-w-md mx-auto text-center select-none animate-in fade-in zoom-in-95 duration-400">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-purple-600/25 via-indigo-600/20 to-cyan-500/20 blur-3xl rounded-full pointer-events-none"></div>

      {/* Top Brand Logo */}
      <div className="space-y-1 z-10 pt-2">
        <div className="inline-flex items-center justify-center space-x-2">
          {/* Stylized AI Badge */}
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-xl shadow-purple-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-[#0b101d] flex items-center justify-center">
                <span className="text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  Ai
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
          AI Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          All-in-One AI Platform
        </p>
      </div>

      {/* Center 3D AI Robot Mascot & Floating Feature Badges */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center z-10">
        {/* Floating Icons orbiting around */}
        {/* 1. Image badge */}
        <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-[#141b2d]/90 border border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/20 backdrop-blur-md animate-pulse">
          <ImageIcon className="w-5 h-5" />
        </div>

        {/* 2. Video badge */}
        <div className="absolute top-6 right-4 p-2.5 rounded-2xl bg-[#141b2d]/90 border border-pink-500/40 text-pink-400 shadow-lg shadow-pink-500/20 backdrop-blur-md">
          <Film className="w-5 h-5" />
        </div>

        {/* 3. Audio/Music badge */}
        <div className="absolute top-1/2 -right-2 p-2.5 rounded-2xl bg-[#141b2d]/90 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/20 backdrop-blur-md">
          <Music className="w-5 h-5" />
        </div>

        {/* 4. Chat bubble badge */}
        <div className="absolute top-1/2 -left-2 p-2.5 rounded-2xl bg-[#141b2d]/90 border border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/20 backdrop-blur-md">
          <MessageSquare className="w-5 h-5" />
        </div>

        {/* 5. Code badge */}
        <div className="absolute bottom-10 right-4 p-2.5 rounded-2xl bg-[#141b2d]/90 border border-purple-500/40 text-purple-400 shadow-lg shadow-purple-500/20 backdrop-blur-md">
          <Code className="w-5 h-5" />
        </div>

        {/* 6. Write badge */}
        <div className="absolute bottom-10 left-4 p-2.5 rounded-2xl bg-[#141b2d]/90 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/20 backdrop-blur-md">
          <PenTool className="w-5 h-5" />
        </div>

        {/* Central SVG Robot */}
        <div
          className="w-56 h-56 sm:w-64 sm:h-64"
          dangerouslySetInnerHTML={{ __html: MOCKUP_ASSETS.robotMascotSvg }}
        />
      </div>

      {/* Bottom Actions & Tagline */}
      <div className="w-full space-y-4 z-10">
        {/* Core Capabilities */}
        <div className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide flex items-center justify-center gap-2">
          <span>Create</span>
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          <span>Write</span>
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          <span>Design</span>
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          <span>Edit</span>
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          <span>Automate</span>
        </div>

        {/* Slider Indicator Dots */}
        <div className="flex items-center justify-center space-x-1.5 py-1">
          <span className="w-6 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
        </div>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Sign In / Configure Link */}
        <div className="text-xs text-slate-400">
          Already have an account?{' '}
          <button
            onClick={onSignIn}
            className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-2 transition"
          >
            Sign In / API Keys
          </button>
        </div>
      </div>
    </div>
  );
};
