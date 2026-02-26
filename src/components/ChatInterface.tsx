import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, X, Sparkles, Globe, ExternalLink, Loader2, Volume2, VolumeX, Play } from 'lucide-react';
import { gemini, ChatMessage } from '../services/gemini';

export default function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Namaskara! I'm your Coastline Realty AI broker. How can I help you with real estate in Mangalore today? I research 99acres, Housing.com, and MagicBricks to provide you with 100% genuine data. Whether you're an NRI looking to invest or a local looking for a new home, I've got you covered."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const playPCM = (base64Data: string) => {
    stopAudio();
    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Int16Array(len / 2);
      for (let i = 0; i < len; i += 2) {
        bytes[i / 2] = (binaryString.charCodeAt(i + 1) << 8) | binaryString.charCodeAt(i);
      }
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioCtx = audioCtxRef.current;
      const buffer = audioCtx.createBuffer(1, bytes.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < bytes.length; i++) {
        channelData[i] = bytes[i] / 32768;
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsPlaying(false);
      
      audioSourceRef.current = source;
      setIsPlaying(true);
      source.start();
    } catch (error) {
      console.error("Audio Playback Error:", error);
      setIsPlaying(false);
    }
  };

  const toggleVoice = () => {
    const newState = !isVoiceEnabled;
    setIsVoiceEnabled(newState);
    if (!newState) {
      stopAudio();
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await gemini.chat(messageText, messages);
      
      if (isVoiceEnabled) {
        const audioData = await gemini.generateSpeech(response.text);
        if (audioData) {
          response.audio = audioData;
          playPCM(audioData);
        }
      }
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e.detail) {
        handleSend(e.detail);
      }
    };
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, [messages, isLoading, isVoiceEnabled]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 group ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <Sparkles className="w-6 h-6" />
        <span className="font-semibold pr-2">Ask AI Broker</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[450px] h-[600px] bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Coastline Realty AI</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-medium opacity-80 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                    Online & Multi-lingual
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPlaying && (
                  <button
                    onClick={stopAudio}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider"
                  >
                    <VolumeX className="w-3 h-3" />
                    Stop
                  </button>
                )}
                <button
                  onClick={toggleVoice}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={isVoiceEnabled ? "Disable Voice" : "Enable Voice"}
                >
                  {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    stopAudio();
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed relative group ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white text-zinc-800 border border-zinc-100 shadow-sm rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                    
                    {msg.audio && (
                      <button
                        onClick={() => playPCM(msg.audio!)}
                        className="absolute -right-10 top-2 p-2 bg-white text-emerald-600 rounded-full shadow-sm border border-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-zinc-100">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                          <Globe className="w-3 h-3" />
                          Verified Sources & Listings
                        </div>
                        <div className="space-y-2">
                          {msg.sources.map((source, si) => (
                            <a
                              key={si}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2.5 bg-zinc-50 hover:bg-emerald-50 border border-zinc-100 hover:border-emerald-200 rounded-xl transition-all group/link"
                            >
                              <div className="flex flex-col gap-0.5 overflow-hidden">
                                <span className="text-[11px] font-bold text-zinc-700 group-hover/link:text-emerald-700 truncate">
                                  {source.title || 'View Source'}
                                </span>
                                <span className="text-[9px] text-zinc-400 truncate">
                                  {new URL(source.uri).hostname}
                                </span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-zinc-300 group-hover/link:text-emerald-500 flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-2 text-zinc-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Researching Mangalore market...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-zinc-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask in Tulu, Kannada, Hindi, English..."
                  className="w-full pl-4 pr-12 py-3 bg-zinc-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-center text-zinc-400">
                Multi-lingual Voice AI with Google Search Grounding
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
