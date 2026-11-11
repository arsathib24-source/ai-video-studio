'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Trash2, Copy, Check, AlertCircle, Cpu } from 'lucide-react';

interface MultiAIChatStudioProps {
  geminiKey?: string;
  openaiKey?: string;
  claudeKey?: string;
  deepseekKey?: string;
  initialInput?: string;
  onOpenSettings: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  reasoning?: string;
}

const MODELS = [
  { id: 'gemini-2.0-flash', name: 'Google Gemini 2.0 Flash', provider: 'Google AI Studio', tag: 'Fast & Free' },
  { id: 'deepseek-r1', name: 'DeepSeek-R1 (Reasoning)', provider: 'DeepSeek', tag: 'Super Smart' },
  { id: 'deepseek-chat', name: 'DeepSeek-V3', provider: 'DeepSeek', tag: 'Coding & General' },
  { id: 'gpt-4o', name: 'ChatGPT (GPT-4o)', provider: 'OpenAI', tag: 'Flagship' },
  { id: 'gpt-4o-mini', name: 'ChatGPT (GPT-4o-mini)', provider: 'OpenAI', tag: 'Fast' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', tag: 'Best Writer' },
];

export const MultiAIChatStudio: React.FC<MultiAIChatStudioProps> = ({
  geminiKey,
  openaiKey,
  claudeKey,
  deepseekKey,
  initialInput,
  onOpenSettings,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'হ্যালো! আমি আপনার অল-ইন-ওয়ান AI চ্যাট অ্যাসিস্ট্যান্ট। আপনি যেকোনো সময় ওপরে ড্রপডাউন থেকে **ChatGPT**, **Claude**, **Gemini**, বা **DeepSeek** বেছে নিয়ে কথা বলতে পারেন। আজ আপনাকে কীভাবে সাহায্য করতে পারি?',
      model: 'gemini-2.0-flash',
    },
  ]);
  const [input, setInput] = useState(initialInput || '');
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Check API keys
    if (selectedModel.startsWith('gemini') && !geminiKey) {
      setError('Gemini মডেল ব্যবহারের জন্য Google Gemini API Key প্রয়োজন। সেটিংস থেকে যুক্ত করুন (ফ্রি)।');
      onOpenSettings();
      return;
    }
    if (selectedModel.startsWith('gpt') && !openaiKey) {
      setError('ChatGPT ব্যবহারের জন্য OpenAI API Key প্রয়োজন। সেটিংস থেকে যুক্ত করুন।');
      onOpenSettings();
      return;
    }
    if (selectedModel.startsWith('claude') && !claudeKey) {
      setError('Claude ব্যবহারের জন্য Anthropic API Key প্রয়োজন। সেটিংস থেকে যুক্ত করুন।');
      onOpenSettings();
      return;
    }
    if (selectedModel.startsWith('deepseek') && !deepseekKey) {
      setError('DeepSeek ব্যবহারের জন্য DeepSeek API Key প্রয়োজন। সেটিংস থেকে যুক্ত করুন।');
      onOpenSettings();
      return;
    }

    const userText = input.trim();
    setInput('');
    setError('');

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
          geminiKey,
          openaiKey,
          claudeKey,
          deepseekKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get AI reply.');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          model: data.model || selectedModel,
          reasoning: data.reasoningContent,
        },
      ]);
    } catch (err: any) {
      setError(err?.message || 'চ্যাট রেসপন্স পেতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'চ্যাট ক্লিয়ার করা হয়েছে। নতুন কোনো প্রশ্ন থাকলে করতে পারেন!',
        model: selectedModel,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[850px] bg-[#0e1626]/80 border border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Top Header / Model Switcher */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Universal AI Chat & Reasoning</span>
            </h2>
            <p className="text-[10px] text-slate-400">ChatGPT, Claude, Gemini & DeepSeek এক জায়গায়</p>
          </div>
        </div>

        {/* Model Dropdown */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 font-medium focus:outline-none focus:border-indigo-500"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.provider})
              </option>
            ))}
          </select>

          <button
            onClick={clearChat}
            title="Clear Chat"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white shrink-0 shadow mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 shadow'
              }`}
            >
              {/* Reasoning Box (for DeepSeek-R1) */}
              {m.reasoning && (
                <div className="mb-2 p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-[11px] text-slate-400 italic">
                  <div className="font-semibold text-indigo-400 mb-0.5">🧠 DeepSeek Thinking Process:</div>
                  <div className="line-clamp-4">{m.reasoning}</div>
                </div>
              )}

              <div className="whitespace-pre-wrap">{m.content}</div>

              {m.role === 'assistant' && (
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-mono">{m.model}</span>
                  <button
                    onClick={() => copyToClipboard(m.content, idx)}
                    className="hover:text-slate-300 flex items-center gap-1 transition"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-200 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white shrink-0 shadow animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>{selectedModel} চিন্তা করছে...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-rose-500/10 border-t border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-[10px] text-rose-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`${MODELS.find((m) => m.id === selectedModel)?.name}-কে যেকোনো প্রশ্ন করুন...`}
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
