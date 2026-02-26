import React from 'react';
import { MapPin, IndianRupee, Home, ArrowUpRight, Heart, PlayCircle, Maximize2, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
  onImageClick?: (property: Property, index: number) => void;
  onCompare?: (property: Property) => void;
  isComparing?: boolean;
}

export default function PropertyCard({ property, onClick, onImageClick, onCompare, isComparing }: PropertyCardProps) {
  const { toggleSaveProperty, isSaved } = useAuth();
  const saved = isSaved(property.id);

  return (
    <div 
      onClick={() => onClick?.(property)}
      className="group bg-white rounded-3xl border border-zinc-100 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 cursor-pointer relative"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleSaveProperty(property.id);
        }}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          saved ? 'bg-orange-500 text-white' : 'bg-white/80 text-gray-400 hover:text-orange-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      </button>

      <div 
        className="relative aspect-[4/3] overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
          onImageClick?.(property, 0);
        }}
      >
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center gap-1.5 border border-white/30">
          <Maximize2 className="w-3.5 h-3.5" />
          View Gallery
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-orange-400/30 shadow-lg shadow-orange-900/20">
              {property.category}
            </span>
            <div className="px-3 py-1 bg-green-600/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-green-400/30 shadow-lg shadow-green-900/20 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              RERA Verified
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompare?.(property);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all border ${
              isComparing
                ? 'bg-orange-500 border-orange-400 text-white'
                : 'bg-white/80 border-white/20 text-gray-400 hover:text-orange-500'
            }`}
            title="Add to Comparison"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
            {property.title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4" />
          {property.location}
        </div>

        {property.status && (
          <div className="flex items-center gap-2 mb-4">
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              property.status === 'Ready to Occupy' ? 'bg-green-100 text-green-700' :
              property.status === 'Under Construction' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {property.status}
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-[10px] font-bold border border-orange-100">
              Vastu: {property.vastu_score || 9}/10
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-100">
              Monsoon: {property.monsoon_index || 4}/5
            </div>
          </div>
        )}

        {property.amenities && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Amenities</p>
            <p className="text-xs text-zinc-600 line-clamp-1">{property.amenities}</p>
          </div>
        )}

        {property.landmarks && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nearby Landmarks</p>
            <p className="text-xs text-zinc-600 line-clamp-1">{property.landmarks}</p>
          </div>
        )}

        {property.virtual_tour_url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(property.virtual_tour_url, '_blank');
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 mb-4 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100"
          >
            <PlayCircle className="w-4 h-4" />
            Virtual Tour
          </button>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-orange-500 font-bold text-xl">
            <IndianRupee className="w-4 h-4" />
            {property.price.replace('₹', '')}
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
            <Home className="w-4 h-4" />
            {property.type}
          </div>
        </div>
      </div>
    </div>
  );
}
