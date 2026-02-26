import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Zap, ArrowRight } from 'lucide-react';
import { sbtxGemini, ArbitrageData } from '../lib/gemini';

export function ArbitrageEngine() {
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null);
  const arbitrageData = sbtxGemini.getArbitrageData();

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return '#10B981';
      case 'HOLD': return '#F59E0B';
      case 'WATCH': return '#6366F1';
      default: return '#66FCF1';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hot': return <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'stable': return <TrendingDown className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  const projectionData = [
    { year: '2024', Kadri: 6850, Bejai: 4660, Derebail: 5200, Surathkal: 3560 },
    { year: '2025', Kadri: 7000, Bejai: 5850, Derebail: 5650, Surathkal: 3680 },
    { year: '2026', Kadri: 7050, Bejai: 6616, Derebail: 5950, Surathkal: 3750 },
    { year: '2027', Kadri: 7350, Bejai: 7100, Derebail: 6800, Surathkal: 3920 },
    { year: '2028', Kadri: 7600, Bejai: 7450, Derebail: 7500, Surathkal: 4150 },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-4">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Module 1: Arbitrage Intelligence</span>
        </div>
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-3">
          Price Arbitrage Dashboard
        </h2>
        <p className="text-cyan-400/70 max-w-2xl mx-auto">
          Verified 2026 baseline data with infrastructure-driven growth projections. Identify undervalued localities before market convergence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-3xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
          <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Current Market Rates (₹/sqft)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={arbitrageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="locality"
                tick={{ fill: '#66FCF1', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis
                tick={{ fill: '#66FCF1', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B0C10',
                  border: '1px solid #66FCF1',
                  borderRadius: '12px',
                  color: '#66FCF1'
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price/sqft']}
              />
              <Bar dataKey="pricePerSqft" radius={[8, 8, 0, 0]}>
                {arbitrageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRecommendationColor(entry.recommendation)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
              <div className="text-xs text-green-400 font-bold uppercase mb-1">Buy</div>
              <div className="text-2xl font-bold text-green-400">
                {arbitrageData.filter(d => d.recommendation === 'BUY').length}
              </div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 text-center">
              <div className="text-xs text-orange-400 font-bold uppercase mb-1">Hold</div>
              <div className="text-2xl font-bold text-orange-400">
                {arbitrageData.filter(d => d.recommendation === 'HOLD').length}
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-center">
              <div className="text-xs text-blue-400 font-bold uppercase mb-1">Watch</div>
              <div className="text-2xl font-bold text-blue-400">
                {arbitrageData.filter(d => d.recommendation === 'WATCH').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-3xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
          <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            5-Year Growth Projection
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#66FCF1', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis
                tick={{ fill: '#66FCF1', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B0C10',
                  border: '1px solid #66FCF1',
                  borderRadius: '12px',
                  color: '#66FCF1'
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              />
              <Legend
                wrapperStyle={{ color: '#66FCF1' }}
                iconType="line"
              />
              <Line type="monotone" dataKey="Kadri" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Bejai" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Derebail" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Surathkal" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Projection Model</p>
                <p className="text-xs text-cyan-400/70 leading-relaxed">
                  Based on LEAP Tech Park construction timeline (40% → 100%), infrastructure catalysts, and historical Bangalore IT corridor convergence patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {arbitrageData.map((locality, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedLocality(locality.locality)}
            className={`bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-2xl p-6 border transition-all cursor-pointer transform hover:scale-105 ${
              selectedLocality === locality.locality
                ? 'border-cyan-500 shadow-lg shadow-cyan-500/30'
                : 'border-cyan-500/20 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-cyan-400">{locality.locality}</h4>
              {getTrendIcon(locality.trend)}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-cyan-400/60 uppercase tracking-wider mb-1">Price/sqft</p>
                <p className="text-2xl font-bold text-cyan-100">₹{locality.pricePerSqft.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs text-cyan-400/60 uppercase tracking-wider mb-1">YoY Growth</p>
                <div className="flex items-center gap-2">
                  <p className={`text-xl font-bold ${locality.yoyGrowth > 15 ? 'text-green-400' : 'text-cyan-400'}`}>
                    +{locality.yoyGrowth}%
                  </p>
                  {locality.yoyGrowth > 15 && <Zap className="w-4 h-4 text-yellow-400" />}
                </div>
              </div>

              <div>
                <p className="text-xs text-cyan-400/60 uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm text-cyan-300">{locality.category}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-cyan-500/20">
              <div
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ backgroundColor: `${getRecommendationColor(locality.recommendation)}20` }}
              >
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: getRecommendationColor(locality.recommendation) }}>
                  {locality.recommendation}
                </span>
                <ArrowRight className="w-4 h-4" style={{ color: getRecommendationColor(locality.recommendation) }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedLocality && (
        <div className="bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-3xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-cyan-400">Detailed Analysis: {selectedLocality}</h3>
            <button
              onClick={() => setSelectedLocality(null)}
              className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm font-bold text-cyan-400 transition-all"
            >
              Close
            </button>
          </div>

          {selectedLocality === 'Derebail' && (
            <div className="space-y-4 text-cyan-100/90">
              <p className="text-sm leading-relaxed">
                <strong className="text-cyan-400">LEAP Tech Park Catalyst:</strong> Construction 40% complete, 11,000 jobs by 2028. Current pricing represents <strong className="text-green-400">20-25% discount</strong> vs. comparable Bangalore IT corridors.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-2">Supply Deficit</p>
                  <p className="text-lg font-bold text-green-400">2,800 units needed</p>
                  <p className="text-xs text-cyan-400/60 mt-1">vs. 1,200 under construction</p>
                </div>
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-2">Expected Rise</p>
                  <p className="text-lg font-bold text-orange-400">+15% by June '26</p>
                  <p className="text-xs text-cyan-400/60 mt-1">Park reaches 60% completion</p>
                </div>
              </div>
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-sm font-bold text-green-400">✅ STRONG BUY - Time-sensitive opportunity. Confidence: 8.7/10</p>
              </div>
            </div>
          )}

          {selectedLocality === 'Bejai' && (
            <div className="space-y-4 text-cyan-100/90">
              <p className="text-sm leading-relaxed">
                <strong className="text-cyan-400">Hospital Cluster Effect:</strong> Extraordinary 42% YoY growth driven by AJ Hospital, KMC Hospital, and Father Muller expansion creating medical tourism demand.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-2">Medical Hub Premium</p>
                  <p className="text-lg font-bold text-green-400">Proven Growth</p>
                  <p className="text-xs text-cyan-400/60 mt-1">White-coat population influx</p>
                </div>
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-2">Rental Yield</p>
                  <p className="text-lg font-bold text-cyan-400">4.2-4.8%</p>
                  <p className="text-xs text-cyan-400/60 mt-1">Doctors seeking proximity</p>
                </div>
              </div>
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-sm font-bold text-green-400">✅ BUY - Hot zone with sustained fundamentals.</p>
              </div>
            </div>
          )}

          {selectedLocality === 'Kadri' && (
            <div className="space-y-4 text-cyan-100/90">
              <p className="text-sm leading-relaxed">
                <strong className="text-cyan-400">Established Luxury Corridor:</strong> Premium locality with mature infrastructure. Slow but stable growth of 2.9% reflects market saturation.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-2">Risk Profile</p>
                  <p className="text-lg font-bold text-blue-400">LOW</p>
                  <p className="text-xs text-cyan-400/60 mt-1">Stable appreciation</p>
                </div>
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-2">Income Generation</p>
                  <p className="text-lg font-bold text-cyan-400">4.2% Yield</p>
                  <p className="text-xs text-cyan-400/60 mt-1">Reliable rental income</p>
                </div>
              </div>
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <p className="text-sm font-bold text-orange-400">⚠️ HOLD - Best for conservative income investors.</p>
              </div>
            </div>
          )}

          {selectedLocality === 'Surathkal' && (
            <div className="space-y-4 text-cyan-100/90">
              <p className="text-sm leading-relaxed">
                <strong className="text-cyan-400">Affordable Student Hub:</strong> NITK proximity ensures steady demand. NH-66 expansion reducing commute time creates upside potential.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-2">Long-term Upside</p>
                  <p className="text-lg font-bold text-green-400">35-42%</p>
                  <p className="text-xs text-cyan-400/60 mt-1">5-year capital appreciation</p>
                </div>
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-2">Risk Factor</p>
                  <p className="text-lg font-bold text-orange-400">MEDIUM</p>
                  <p className="text-xs text-cyan-400/60 mt-1">Monsoon flooding zones</p>
                </div>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-sm font-bold text-blue-400">👁️ WATCH - Monitor infrastructure progress. Entry for patient investors.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
