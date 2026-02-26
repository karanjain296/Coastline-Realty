import React from 'react';
import { motion } from 'motion/react';
import { X, Check, Minus, IndianRupee, MapPin, Building2, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Property } from '../types';

interface PropertyComparisonProps {
  properties: Property[];
  onRemove: (id: number) => void;
  onClose: () => void;
}

export default function PropertyComparison({ properties, onRemove, onClose }: PropertyComparisonProps) {
  if (properties.length === 0) return null;

  const features = [
    { label: 'Price', key: 'price', icon: IndianRupee },
    { label: 'Location', key: 'location', icon: MapPin },
    { label: 'Type', key: 'type', icon: Building2 },
    { label: 'Status', key: 'status', icon: Sparkles },
    { label: 'Builder', key: 'builder_name', icon: Building2 },
    { label: 'RERA ID', key: 'rera_id', icon: ShieldCheck },
    { label: 'Smart City Score', key: 'smart_city_score', icon: Zap },
    { label: 'Vastu Score', key: 'vastu_score', icon: Sparkles },
    { label: 'Flood Risk', key: 'flood_risk', icon: ShieldCheck },
    { label: 'Sqft Rate', key: 'sqft_rate', icon: IndianRupee },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-[150] bg-white overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">Property Comparison</h2>
            <p className="text-zinc-500">Compare features side-by-side to make an informed decision.</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left bg-zinc-50 border border-zinc-100 min-w-[200px]">
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Feature</span>
                </th>
                {properties.map((property) => (
                  <th key={property.id} className="p-4 text-left border border-zinc-100 min-w-[280px] relative group">
                    <button
                      onClick={() => onRemove(property.id)}
                      className="absolute top-2 right-2 p-1 bg-red-50 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                      <img
                        src={property.image_url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-zinc-900 truncate">{property.title}</h3>
                    <p className="text-xs text-zinc-500 truncate">{property.location}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.key}>
                  <td className="p-4 bg-zinc-50 border border-zinc-100 font-bold text-zinc-700 flex items-center gap-2">
                    <feature.icon className="w-4 h-4 text-emerald-600" />
                    {feature.label}
                  </td>
                  {properties.map((property) => {
                    const value = (property as any)[feature.key];
                    return (
                      <td key={property.id} className="p-4 border border-zinc-100 text-sm text-zinc-600">
                        {value === true ? (
                          <Check className="w-5 h-5 text-emerald-500" />
                        ) : value === false ? (
                          <Minus className="w-5 h-5 text-zinc-300" />
                        ) : value || 'N/A'}
                        {feature.key === 'smart_city_score' && value && (
                          <div className="mt-2 w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full" 
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-4 bg-zinc-50 border border-zinc-100 font-bold text-zinc-700">Amenities</td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 border border-zinc-100">
                    <div className="flex flex-wrap gap-1">
                      {property.amenities?.split(',').map((amenity, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold uppercase">
                          {amenity.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
