import React, { useState } from 'react';
import { X, Cpu, TrendingUp, Building2 } from 'lucide-react';
import { ArbitrageEngine } from './ArbitrageEngine';
import { AIAssessmentTerminal } from './AIAssessmentTerminal';
import { BuilderEcosystem } from './BuilderEcosystem';

interface SBTXOracleProps {
  onClose: () => void;
}

export function SBTXOracle({ onClose }: SBTXOracleProps) {
  const [activeTab, setActiveTab] = useState<'arbitrage' | 'terminal' | 'builder'>('arbitrage');

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md overflow-y-auto">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                    <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse border-2 border-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-tight">
                    SBTX AI ORACLE
                  </h1>
                  <p className="text-cyan-400/60 text-sm font-medium tracking-wider">
                    Silicon Beach Tech Exchange · Intelligence System v3.0
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-3 bg-gray-800 hover:bg-gray-700 border border-cyan-500/30 rounded-xl text-cyan-400 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-1 mb-8 border border-cyan-500/20">
            <div className="flex gap-2 bg-[#0B0C10] rounded-xl p-2">
              <button
                onClick={() => setActiveTab('arbitrage')}
                className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'arbitrage'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/5'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Arbitrage Engine</span>
              </button>

              <button
                onClick={() => setActiveTab('terminal')}
                className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'terminal'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/5'
                }`}
              >
                <Cpu className="w-5 h-5" />
                <span>AI Terminal</span>
              </button>

              <button
                onClick={() => setActiveTab('builder')}
                className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'builder'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/5'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span>Builder Ecosystem</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 blur-3xl -z-10" />

            {activeTab === 'arbitrage' && <ArbitrageEngine />}
            {activeTab === 'terminal' && <AIAssessmentTerminal />}
            {activeTab === 'builder' && <BuilderEcosystem />}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-2xl border border-cyan-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-cyan-400 mb-2">About SBTX Oracle</h3>
                <p className="text-sm text-cyan-400/70 leading-relaxed">
                  Silicon Beach Tech Exchange AI Oracle is an advanced real estate intelligence platform designed for Mangalore's emerging tech ecosystem.
                  Powered by Google Gemini with live search grounding, it provides arbitrage analysis, infrastructure-driven yield projections,
                  and builder viability assessments based on LEAP Tech Park development and Smart City initiatives.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-400">
                    Google Search Grounding
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-400">
                    Real-time Market Data
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-400">
                    Infrastructure Analytics
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-400">
                    B2B Builder Tools
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
