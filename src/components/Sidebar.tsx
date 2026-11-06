'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Film,
  Image as ImageIcon,
  MessageSquare,
  BookOpen,
  Bot,
  Key,
  Sparkles,
  Zap,
  ChevronRight,
  ShieldCheck,
  Compass,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export type MainNavTab = 'home' | 'videos' | 'images' | 'chat' | 'notebook' | 'agents';

interface SidebarProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onOpenSettings: () => void;
  hasGeminiKey: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  hasGeminiKey,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved !== null) {
        setInternalCollapsed(saved === 'true');
      }
    }
  }, []);

  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalCollapsed;

  const toggleSidebar = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      const next = !internalCollapsed;
      setInternalCollapsed(next);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebar_collapsed', String(next));
      }
    }
  };

  const navItems = [
    {
      id: 'home' as MainNavTab,
      label: 'Home Dashboard',
      sublabel: 'Overview & Launchpad',
      icon: Home,
      badge: 'Main',
      gradient: 'from-blue-500 via-indigo-500 to-purple-600',
      activeGlow: 'shadow-blue-500/20 border-blue-500/40',
    },
    {
      id: 'videos' as MainNavTab,
      label: 'Video & Shorts Studio',
      sublabel: 'T2V, I2V, Auto 9:16 Reels',
      icon: Film,
      badge: 'Popular',
      gradient: 'from-pink-500 via-rose-500 to-indigo-500',
      activeGlow: 'shadow-pink-500/20 border-pink-500/40',
    },
    {
      id: 'images' as MainNavTab,
      label: 'AI Image Studio',
      sublabel: 'FLUX.1 8K Photorealistic',
      icon: ImageIcon,
      badge: 'Free',
      gradient: 'from-purple-500 via-indigo-500 to-pink-500',
      activeGlow: 'shadow-purple-500/20 border-purple-500/40',
    },
    {
      id: 'chat' as MainNavTab,
      label: 'Multi-AI Chat',
      sublabel: 'ChatGPT, Claude, DeepSeek',
      icon: MessageSquare,
      badge: 'Smart',
      gradient: 'from-indigo-500 via-blue-500 to-cyan-400',
      activeGlow: 'shadow-indigo-500/20 border-indigo-500/40',
    },
    {
      id: 'notebook' as MainNavTab,
      label: 'NotebookLM Hub',
      sublabel: 'Doc Q&A & Audio Podcast',
      icon: BookOpen,
      badge: 'New',
      gradient: 'from-amber-400 via-orange-500 to-rose-500',
      activeGlow: 'shadow-amber-500/20 border-amber-500/40',
    },
    {
      id: 'agents' as MainNavTab,
      label: 'Antigravity Agents',
      sublabel: 'Autonomous Workflows',
      icon: Bot,
      badge: 'Auto',
      gradient: 'from-emerald-400 via-teal-500 to-indigo-500',
      activeGlow: 'shadow-emerald-500/20 border-emerald-500/40',
    },
  ];

  return (
    <aside
      className="w-full h-full transition-all duration-300 ease-in-out bg-[#090d18]/95 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 shadow-2xl backdrop-blur-2xl relative z-40 overflow-hidden"
    >
      <div className="space-y-6">
        {/* Brand / Logo Top Row */}
        <div
          className={`flex items-center transition-all ${
            isCollapsed ? 'justify-center px-0' : 'justify-between px-2'
          } pt-1`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative group cursor-pointer" onClick={toggleSidebar}>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border border-white/20 flex items-center justify-center shadow-xl">
                <Zap className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              </div>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>Super AI</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-sm">
                    Studio
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">Next-Gen Suite</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Section with Toggle Button right beside CREATIVE STUDIOS */}
        <div className="space-y-2">
          {/* Header Row with Toggle Button beside Creative Studios */}
          <div
            className={`flex items-center transition-all ${
              isCollapsed ? 'justify-center' : 'justify-between px-2.5'
            } mb-2`}
          >
            {!isCollapsed ? (
              <>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Creative Studios
                </span>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-xl bg-[#0e1627] border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white transition shadow group"
                  title="সাইডবার সংকুচিত করুন (Collapse Sidebar)"
                >
                  <PanelLeftClose className="w-4 h-4 group-hover:scale-110 transition text-indigo-400" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-[#0e1627] border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition shadow group"
                title="সাইডবার প্রসারিত করুন (Expand Sidebar)"
              >
                <PanelLeftOpen className="w-4 h-4 group-hover:scale-110 transition text-indigo-400" />
              </button>
            )}
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? `${item.label} (${item.badge})` : undefined}
                  className={`w-full rounded-2xl text-left transition-all duration-300 flex items-center group relative overflow-hidden ${
                    isCollapsed
                      ? 'justify-center p-2.5'
                      : 'justify-between p-3'
                  } ${
                    isActive
                      ? `bg-slate-900/90 border ${item.activeGlow} shadow-lg text-white`
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 border border-transparent'
                  }`}
                >
                  {/* Left Active Glow bar */}
                  {isActive && (
                    <div
                      className={`absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-gradient-to-b ${item.gradient}`}
                    ></div>
                  )}

                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3.5 pl-1'}`}>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isActive
                          ? `bg-gradient-to-tr ${item.gradient} text-white shadow-lg`
                          : 'bg-slate-800/60 border border-slate-700/40 text-slate-400 group-hover:text-white group-hover:scale-105'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {!isCollapsed && (
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold tracking-tight text-slate-100 truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-400 group-hover:text-slate-300 transition line-clamp-1">
                          {item.sublabel}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border transition shrink-0 ${
                        isActive
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-slate-800/80 text-slate-500 border-slate-700/40 group-hover:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2 mt-4">
        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          title={isCollapsed ? 'API Keys & Settings' : undefined}
          className={`w-full rounded-2xl border border-slate-800 hover:border-indigo-500/50 bg-slate-900/60 hover:bg-slate-900 text-xs text-slate-200 flex items-center transition-all duration-300 shadow group ${
            isCollapsed ? 'justify-center p-2.5' : 'justify-between p-3'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition shrink-0">
              <Key className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && <span className="font-semibold">API Keys</span>}
          </div>

          {!isCollapsed && (
            <div className="flex items-center space-x-1.5">
              {hasGeminiKey ? (
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active
                </span>
              ) : (
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Set Key</span>
              )}
            </div>
          )}
        </button>

        {/* Cross-Platform Device Pill */}
        {!isCollapsed && (
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-950/30 via-slate-900/60 to-purple-950/30 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-200">Cross-Platform PWA</p>
              <p className="text-[9px] text-slate-400">Windows • Android • iOS</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          </div>
        )}
      </div>
    </aside>
  );
};
