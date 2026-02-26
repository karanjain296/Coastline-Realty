import React from 'react';
import { TrendingUp, Clock } from 'lucide-react';

export function UrgencyBar() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center flex-wrap">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 animate-pulse" />
          <span className="font-bold">TIME-SENSITIVE OPPORTUNITY:</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/90">
            Derebail IT Park construction is 40% complete.
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +15% projected price rise by June 2026
          </span>
        </div>
      </div>
    </div>
  );
}
