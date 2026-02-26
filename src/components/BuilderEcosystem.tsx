import React, { useState } from 'react';
import { Building2, Droplet, Zap, Users, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { sbtxGemini, LandViabilityResult } from '../lib/gemini';

export function BuilderEcosystem() {
  const [pincode, setPincode] = useState('');
  const [projectType, setProjectType] = useState('residential');
  const [isAssessing, setIsAssessing] = useState(false);
  const [result, setResult] = useState<LandViabilityResult | null>(null);

  const handleAssess = async () => {
    if (!pincode) return;

    setIsAssessing(true);
    setResult(null);

    try {
      const assessment = await sbtxGemini.assessLandViability(pincode, projectType);
      setResult(assessment);
    } catch (error) {
      console.error('Assessment Error:', error);
    } finally {
      setIsAssessing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-400';
    if (score >= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 7) return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (score >= 5) return <AlertTriangle className="w-6 h-6 text-orange-400" />;
    return <XCircle className="w-6 h-6 text-red-400" />;
  };

  const commonPincodes = [
    { code: '575004', area: 'Urwa (Mixed Use Hub)' },
    { code: '575003', area: 'Kodialbail (Coastal Premium)' },
    { code: '575002', area: 'Bejai (Medical Cluster)' },
    { code: '575006', area: 'Derebail (Tech Park Zone)' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-4">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Module 2: Builder Intelligence</span>
        </div>
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-3">
          Land Viability Assessor
        </h2>
        <p className="text-cyan-400/70 max-w-2xl mx-auto">
          B2B tool for builders and developers. Assess zoning, infrastructure, and absorption rates before land acquisition.
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-3xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-cyan-400 mb-6">Assessment Parameters</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-cyan-400/70 uppercase tracking-wider mb-3">
                  Target Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g., 575004"
                  className="w-full bg-gray-800/50 border border-cyan-500/20 rounded-xl px-4 py-3 text-cyan-100 placeholder-cyan-400/30 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {commonPincodes.map((pc) => (
                    <button
                      key={pc.code}
                      onClick={() => setPincode(pc.code)}
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-400 transition-all"
                    >
                      {pc.code} - {pc.area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-cyan-400/70 uppercase tracking-wider mb-3">
                  Project Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'residential', label: 'Residential', icon: Building2 },
                    { value: 'commercial', label: 'Commercial', icon: Users },
                    { value: 'data_center', label: 'Data Center', icon: Zap }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setProjectType(type.value)}
                      className={`p-4 rounded-xl border transition-all ${
                        projectType === type.value
                          ? 'bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                          : 'bg-gray-800/50 border-cyan-500/20 hover:border-cyan-500/40'
                      }`}
                    >
                      <type.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-xs font-bold text-cyan-400 text-center">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAssess}
                disabled={!pincode || isAssessing}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                {isAssessing ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Analyzing Land Viability...
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5" />
                    Generate AI Assessment
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            {!result && !isAssessing && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Building2 className="w-10 h-10 text-cyan-400/50" />
                  </div>
                  <p className="text-cyan-400/50 text-sm">
                    Enter pincode to generate viability assessment
                  </p>
                </div>
              </div>
            )}

            {isAssessing && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Sparkles className="w-10 h-10 text-cyan-400 animate-spin" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                  </div>
                  <p className="text-cyan-400 text-sm font-medium">
                    Analyzing infrastructure, regulations, and market dynamics...
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 h-full overflow-y-auto pr-2">
                <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-cyan-400 mb-1">AI Verdict</h4>
                      <p className="text-xs text-cyan-400/60">Pincode: {result.pincode}</p>
                    </div>
                  </div>
                  <p className="text-sm text-cyan-100 leading-relaxed whitespace-pre-line">
                    {result.aiVerdict}
                  </p>
                </div>

                <div className="p-6 bg-gray-800/40 rounded-2xl border border-cyan-500/20">
                  <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">
                    Zonal Regulations
                  </h4>
                  <p className="text-sm text-cyan-100/80 leading-relaxed">
                    {result.zonalRegulation}
                  </p>
                </div>

                <div className="p-6 bg-gray-800/40 rounded-2xl border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                      Data Center Suitability
                    </h4>
                    <div className="flex items-center gap-2">
                      {getScoreIcon(result.dataCenterSuitability.score)}
                      <span className={`text-2xl font-bold ${getScoreColor(result.dataCenterSuitability.score)}`}>
                        {result.dataCenterSuitability.score}/10
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Droplet className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-1">Water Availability</p>
                        <p className="text-sm text-cyan-100/80">{result.dataCenterSuitability.waterAvailability}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-1">Power Infrastructure</p>
                        <p className="text-sm text-cyan-100/80">{result.dataCenterSuitability.powerInfra}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-800/40 rounded-2xl border border-cyan-500/20">
                  <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">
                    <Users className="w-4 h-4 inline mr-2" />
                    Absorption Rate Forecast
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-1">Projected Sales Velocity</p>
                      <p className="text-lg font-bold text-green-400">{result.absorptionRate.estimate}</p>
                    </div>

                    <div>
                      <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-1">Tech Worker Demand</p>
                      <p className="text-sm text-cyan-100/80">{result.absorptionRate.techWorkerDemand}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-3xl p-8 border border-cyan-500/20">
        <h3 className="text-xl font-bold text-cyan-400 mb-6">Assessment Methodology</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-cyan-400 mb-2">MCC Zoning Data</h4>
            <p className="text-xs text-cyan-400/70 leading-relaxed">
              Cross-referenced with Mangalore City Corporation development control regulations, FSI limits, and height restrictions.
            </p>
          </div>

          <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-cyan-400 mb-2">Infrastructure Grid</h4>
            <p className="text-xs text-cyan-400/70 leading-relaxed">
              MESCOM power capacity, KUWS water supply, and fiber optic backbone availability for tech infrastructure.
            </p>
          </div>

          <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-cyan-400 mb-2">Demand Modeling</h4>
            <p className="text-xs text-cyan-400/70 leading-relaxed">
              Tech worker migration patterns, LEAP Park job projections, and historical absorption rates from similar projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
