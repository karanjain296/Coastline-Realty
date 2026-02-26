import React, { useState } from 'react';
import { X, Cpu, TrendingUp, MapPin, MessageCircle } from 'lucide-react';
import { ArbitrageFinder } from './ArbitrageFinder';
import { InfraPulseMap } from './InfraPulseMap';

interface SiliconBeachTerminalProps {
  onClose: () => void;
}

export function SiliconBeachTerminal({ onClose }: SiliconBeachTerminalProps) {
  const [activeTab, setActiveTab] = useState<'arbitrage' | 'map'>('arbitrage');

  const generateWhatsAppReport = () => {
    const reportText = encodeURIComponent(`🚀 *MANGALORE SILICON BEACH TERMINAL*
📊 Investment Intelligence Report 2026

*VERIFIED MARKET DATA:*
• Kadri: ₹7,050/sqft (+16% YoY)
• Bejai: ₹7,000/sqft (+42% YoY)
• Derebail: ₹5,950/sqft (+14.4% YoY)

*LEAP TECH PARK STATUS:*
• 3.5 Lakh sqft Grade-A space
• 11,000 projected jobs by 2028
• 40% construction complete
• Operational: Q4 2026

*GOLDEN RADIUS OPPORTUNITY:*
Properties within 3km of Tech Park receive 1.5x growth multiplier.

*NMPA PORT UPDATE:*
• Record 5.44 MMT handled (Dec 2025)
• Warehouse demand surge

📈 Want detailed ROI analysis for your target locality?

Reply with your preferred investment zone!`);

    window.open(`https://wa.me/919876543210?text=${reportText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md overflow-y-auto">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 animate-pulse">
                    <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping border-2 border-black" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full border-2 border-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-tight">
                    SILICON BEACH TERMINAL
                  </h1>
                  <p className="text-cyan-400/60 text-sm font-medium tracking-wider">
                    High-Velocity Real Estate & Logistics Intelligence · Mangalore 2026
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={generateWhatsAppReport}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/30 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Report
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-gray-800 hover:bg-gray-700 border border-cyan-500/30 rounded-xl text-cyan-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
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
                <span>Arbitrage Finder</span>
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'map'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/5'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span>Infra-Pulse Map</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 blur-3xl -z-10" />

            {activeTab === 'arbitrage' && <ArbitrageFinder />}
            {activeTab === 'map' && <InfraPulseMap />}
          </div>

          <div className="mt-8 bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-2xl border border-cyan-500/20 p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-cyan-400 mb-1">₹7,050</div>
                <div className="text-xs text-cyan-400/70 uppercase tracking-wider">Kadri (Premium)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-green-400 mb-1">₹5,950</div>
                <div className="text-xs text-green-400/70 uppercase tracking-wider">Derebail (Golden)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-orange-400 mb-1">11,000</div>
                <div className="text-xs text-orange-400/70 uppercase tracking-wider">Tech Jobs (2028)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-400 mb-1">5.44 MMT</div>
                <div className="text-xs text-blue-400/70 uppercase tracking-wider">NMPA Cargo (Dec '25)</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-6 bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-2xl border border-cyan-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-cyan-400 mb-2">About Silicon Beach Terminal</h3>
                <p className="text-sm text-cyan-400/70 leading-relaxed mb-4">
                  Real-time arbitrage analysis for Mangalore's emerging tech corridor. Powered by verified 2026 market data,
                  infrastructure catalysts, and Silicon Beach growth multipliers. LEAP Tech Park (11,000 jobs) driving
                  unprecedented value appreciation in the Golden Radius (3km zone).
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-400">
                    ✓ Verified 2026 Rates
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-400">
                    ✓ 1.5x Silicon Beach Multiplier
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-400">
                    ✓ NMPA Logistics Integration
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-400">
                    ✓ WhatsApp Report Export
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
