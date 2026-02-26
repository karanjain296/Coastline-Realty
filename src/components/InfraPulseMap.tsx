import React, { useState } from 'react';
import { MapPin, Zap, Building2, Ship, Radio, Navigation } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'tech' | 'locality' | 'port' | 'infra';
  price?: number;
  inGoldenRadius: boolean;
}

export function InfraPulseMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showGoldenRadius, setShowGoldenRadius] = useState(true);

  const locations: Location[] = [
    { id: 'leap', name: 'LEAP Tech Park', x: 50, y: 40, type: 'tech', inGoldenRadius: true },
    { id: 'derebail', name: 'Derebail (₹5,950/sqft)', x: 52, y: 43, type: 'locality', price: 5950, inGoldenRadius: true },
    { id: 'kottara', name: 'Kottara (₹5,500/sqft)', x: 48, y: 45, type: 'locality', price: 5500, inGoldenRadius: true },
    { id: 'chilimbi', name: 'Chilimbi (₹6,200/sqft)', x: 54, y: 38, type: 'locality', price: 6200, inGoldenRadius: true },
    { id: 'bejai', name: 'Bejai (₹7,000/sqft)', x: 46, y: 50, type: 'locality', price: 7000, inGoldenRadius: false },
    { id: 'kadri', name: 'Kadri (₹7,050/sqft)', x: 44, y: 48, type: 'locality', price: 7050, inGoldenRadius: false },
    { id: 'surathkal', name: 'Surathkal (₹3,750/sqft)', x: 58, y: 25, type: 'locality', price: 3750, inGoldenRadius: false },
    { id: 'nmpa', name: 'NMPA Port (5.44 MMT)', x: 35, y: 60, type: 'port', inGoldenRadius: false },
    { id: 'airport', name: 'Mangalore Airport', x: 30, y: 30, type: 'infra', inGoldenRadius: false },
  ];

  const getLocationColor = (loc: Location) => {
    if (loc.type === 'tech') return '#66FCF1';
    if (loc.type === 'port') return '#3B82F6';
    if (loc.type === 'infra') return '#8B5CF6';
    if (loc.inGoldenRadius) return '#10B981';
    return '#F59E0B';
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'tech': return Building2;
      case 'port': return Ship;
      case 'infra': return Navigation;
      default: return MapPin;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-3xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <Radio className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-cyan-400">Infra-Pulse Map</h3>
              <p className="text-xs text-cyan-400/60">Silicon Beach Golden Radius · Interactive Territory View</p>
            </div>
          </div>
          <button
            onClick={() => setShowGoldenRadius(!showGoldenRadius)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              showGoldenRadius
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-gray-800 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            {showGoldenRadius ? 'Hide' : 'Show'} Golden Radius
          </button>
        </div>

        <div className="relative bg-gray-950 rounded-2xl border border-cyan-500/30 overflow-hidden" style={{ height: '600px' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
            <defs>
              <radialGradient id="goldenRadius" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#66FCF1" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#66FCF1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#66FCF1" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {showGoldenRadius && (
              <>
                <circle
                  cx="50"
                  cy="40"
                  r="15"
                  fill="url(#goldenRadius)"
                  stroke="#66FCF1"
                  strokeWidth="0.3"
                  strokeDasharray="1,1"
                  opacity="0.6"
                />
                <text
                  x="50"
                  y="25"
                  textAnchor="middle"
                  fill="#66FCF1"
                  fontSize="2"
                  fontWeight="bold"
                  opacity="0.8"
                >
                  GOLDEN RADIUS (3KM)
                </text>
              </>
            )}

            {locations.map((loc, idx) => (
              <g key={loc.id}>
                {loc.type === 'tech' && (
                  <>
                    {locations.filter(l => l.inGoldenRadius && l.type === 'locality').map(target => (
                      <line
                        key={`${loc.id}-${target.id}`}
                        x1={loc.x}
                        y1={loc.y}
                        x2={target.x}
                        y2={target.y}
                        stroke="#66FCF1"
                        strokeWidth="0.2"
                        strokeDasharray="0.5,0.5"
                        opacity="0.3"
                      />
                    ))}
                  </>
                )}

                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r={loc.type === 'tech' ? 2.5 : 1.5}
                  fill={getLocationColor(loc)}
                  stroke={selectedLocation?.id === loc.id ? '#FFFFFF' : getLocationColor(loc)}
                  strokeWidth={selectedLocation?.id === loc.id ? 0.5 : 0.2}
                  filter="url(#glow)"
                  className="cursor-pointer transition-all hover:r-3"
                  onClick={() => setSelectedLocation(loc)}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.6;1"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {loc.type === 'tech' && (
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r="3"
                    fill="none"
                    stroke="#66FCF1"
                    strokeWidth="0.3"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      values="3;5;3"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0;0.5"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                <text
                  x={loc.x}
                  y={loc.y - 3}
                  textAnchor="middle"
                  fill={getLocationColor(loc)}
                  fontSize="1.2"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {loc.name.split(' ')[0]}
                </text>
              </g>
            ))}

            <g transform="translate(5, 85)">
              <text fill="#66FCF1" fontSize="1.5" fontWeight="bold">MANGALORE</text>
              <text y="3" fill="#66FCF1" fontSize="1" opacity="0.6">SILICON BEACH 2026</text>
            </g>
          </svg>

          {selectedLocation && (
            <div className="absolute bottom-6 right-6 bg-gray-900/95 backdrop-blur-md border-2 border-cyan-500/50 rounded-2xl p-6 w-80 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${getLocationColor(selectedLocation)}20` }}
                  >
                    {React.createElement(getLocationIcon(selectedLocation.type), {
                      className: 'w-5 h-5',
                      style: { color: getLocationColor(selectedLocation) }
                    })}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-cyan-100">{selectedLocation.name}</h4>
                    <p className="text-xs text-cyan-400/60 uppercase tracking-wider">
                      {selectedLocation.type === 'tech' ? 'Tech Infrastructure' :
                       selectedLocation.type === 'port' ? 'Logistics Hub' :
                       selectedLocation.type === 'infra' ? 'Transport Node' : 'Residential Zone'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-cyan-400/60 hover:text-cyan-400 transition-colors"
                >
                  ×
                </button>
              </div>

              {selectedLocation.price && (
                <div className="space-y-3">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                    <div className="text-xs text-cyan-400/70 uppercase tracking-wider mb-1">Current Rate</div>
                    <div className="text-2xl font-bold text-cyan-100">₹{selectedLocation.price.toLocaleString()}/sqft</div>
                  </div>

                  {selectedLocation.inGoldenRadius && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-green-400" />
                        <div className="text-xs text-green-400 font-bold uppercase tracking-wider">Golden Radius Zone</div>
                      </div>
                      <div className="text-xs text-green-300/80">
                        Within 3km of LEAP Tech Park. Silicon Beach Multiplier: 1.5x
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedLocation.id === 'leap' && (
                <div className="mt-4 space-y-2 text-sm text-cyan-100/80">
                  <p className="font-bold text-cyan-400">LEAP Tech Park (Blueberry Hills)</p>
                  <p>• 3.5 Lakh sqft Grade-A office space</p>
                  <p>• 11,000 projected jobs by 2028</p>
                  <p>• 40% construction complete (Feb 2026)</p>
                  <p className="text-green-400 font-bold">Expected operational: Q4 2026</p>
                </div>
              )}

              {selectedLocation.id === 'nmpa' && (
                <div className="mt-4 space-y-2 text-sm text-cyan-100/80">
                  <p className="font-bold text-cyan-400">New Mangalore Port (NMPA)</p>
                  <p>• Record 5.44 MMT handled (Dec 2025)</p>
                  <p>• Major cargo: Coal, Iron Ore, Containers</p>
                  <p>• Fractional warehouse investment units available</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Tech Hub</span>
            </div>
            <p className="text-xs text-cyan-100/70">LEAP Tech Park epicenter</p>
          </div>

          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Golden Zone</span>
            </div>
            <p className="text-xs text-green-100/70">Within 3km radius (1.5x multiplier)</p>
          </div>

          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Established</span>
            </div>
            <p className="text-xs text-orange-100/70">Premium localities (stable yield)</p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Infrastructure</span>
            </div>
            <p className="text-xs text-blue-100/70">Port & transport nodes</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-[#0B0C10] to-gray-900 rounded-3xl p-8 border border-cyan-500/20">
        <h4 className="text-lg font-bold text-cyan-400 mb-4">Infrastructure Catalysts (2026-2028)</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <h5 className="text-sm font-bold text-cyan-400 uppercase">LEAP Tech Park</h5>
            </div>
            <p className="text-xs text-cyan-100/80 leading-relaxed mb-2">
              3.5L sqft Grade-A space. Expected tenants: IT/ITES, fintech startups. Target: 11,000 jobs by 2028.
            </p>
            <div className="text-xs text-green-400 font-bold">Status: 40% Complete (Q4 2026 delivery)</div>
          </div>

          <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Ship className="w-5 h-5 text-blue-400" />
              <h5 className="text-sm font-bold text-cyan-400 uppercase">NMPA Expansion</h5>
            </div>
            <p className="text-xs text-cyan-100/80 leading-relaxed mb-2">
              Record 5.44 MMT handled (Dec 2025). New berths under construction. Warehouse demand surge.
            </p>
            <div className="text-xs text-blue-400 font-bold">Fractional investment units launching</div>
          </div>

          <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-5 h-5 text-purple-400" />
              <h5 className="text-sm font-bold text-cyan-400 uppercase">Smart City Projects</h5>
            </div>
            <p className="text-xs text-cyan-100/80 leading-relaxed mb-2">
              Waterfront Promenade (65% complete), Integrated Transport Hub (planning phase).
            </p>
            <div className="text-xs text-purple-400 font-bold">₹500 Cr investment committed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
