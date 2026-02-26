import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, ExternalLink, Terminal } from 'lucide-react';
import { sbtxGemini, SBTXMessage } from '../lib/gemini';

export function AIAssessmentTerminal() {
  const [messages, setMessages] = useState<SBTXMessage[]>([
    {
      role: 'model',
      text: '## SBTX AI ORACLE INITIALIZED\n\nSilicon Beach Tech Exchange Intelligence System v3.0\n\nI can analyze:\n- **Arbitrage Opportunities** (price gaps between localities)\n- **5-Year Yield Projections** (infrastructure-driven growth)\n- **Tech Migration Patterns** (LEAP Park impact)\n- **Land Viability** (builder assessments)\n\nTry: "Compare 5-year yield between Kadri and Surathkal"',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: SBTXMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await sbtxGemini.analyzeArbitrage(input, messages);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('AI Assessment Error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: '⚠️ System temporarily unavailable. Analysis engine restarting...',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickPrompts = [
    'Compare Kadri vs Surathkal yield',
    'Derebail IT Park analysis',
    'Best arbitrage opportunity?',
    'Bejai growth drivers'
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Terminal className="w-6 h-6 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-cyan-400 tracking-wide">AI ASSESSMENT TERMINAL</h3>
              <p className="text-xs text-cyan-400/60">Silicon Beach Intelligence v3.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/30">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-[#0B0C10]/50 backdrop-blur-sm">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                  : 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-cyan-500/10'
              } rounded-2xl p-4 backdrop-blur-sm`}
            >
              {message.role === 'model' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">SBTX Oracle</span>
                </div>
              )}

              <div
                className={`prose prose-sm ${
                  message.role === 'user' ? 'prose-invert' : 'prose-cyan'
                } max-w-none`}
              >
                <div
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: message.role === 'user' ? '#E0E0E0' : '#66FCF1' }}
                  dangerouslySetInnerHTML={{
                    __html: message.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                      .replace(/^## (.*?)$/gm, '<h3 class="text-base font-bold text-cyan-300 mt-3 mb-2">$1</h3>')
                      .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
                      .replace(/⚡/g, '<span class="text-yellow-400">⚡</span>')
                      .replace(/✅/g, '<span class="text-green-400">✅</span>')
                      .replace(/⚠️/g, '<span class="text-orange-400">⚠️</span>')
                      .replace(/❌/g, '<span class="text-red-400">❌</span>')
                  }}
                />
              </div>

              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-cyan-500/20">
                  <p className="text-xs font-bold text-cyan-400/70 uppercase tracking-wider mb-2">Sources</p>
                  <div className="space-y-1">
                    {message.sources.map((source, sidx) => (
                      <a
                        key={sidx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-cyan-400/80 hover:text-cyan-400 transition-colors group"
                      >
                        <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                        <span className="truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2 text-right">
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-cyan-500/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-cyan-400/70">Analyzing market intelligence...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-cyan-500/20 bg-gray-900/80 backdrop-blur-sm p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInput(prompt)}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-400 transition-all transform hover:scale-105"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about arbitrage opportunities, yield projections, or land viability..."
            className="flex-1 bg-gray-800/50 border border-cyan-500/20 rounded-xl px-4 py-3 text-sm text-cyan-100 placeholder-cyan-400/30 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all transform hover:scale-105 disabled:transform-none shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            {isProcessing ? (
              <TrendingUp className="w-5 h-5 animate-pulse" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
