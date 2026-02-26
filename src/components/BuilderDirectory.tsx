import React, { useState } from 'react';
import { ExternalLink, Globe, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BUILDERS = [
  { name: 'Land Trades', url: 'https://www.landtrades.in', description: 'Premier developers with iconic projects like Solitaire and Altura.' },
  { name: 'Rohan Corporation', url: 'https://rohancorporation.in', description: 'Leading developers known for Rohan City and Zorion.' },
  { name: 'Inland Builders', url: 'https://www.inlandbuilders.com', description: 'Renowned for quality construction and landmark projects.' },
  { name: 'Mohtisham', url: 'https://mohtisham.com', description: 'Pioneers in luxury and eco-friendly residential spaces.' },
  { name: 'Northern Sky', url: 'https://northernsky.in', description: 'Focused on integrated townships and modern lifestyle.' },
  { name: 'Prestige Group', url: 'https://www.prestigeconstructions.com', description: 'National leader with significant presence in Mangalore.' },
  { name: 'Brigade Group', url: 'https://www.brigadegroup.com', description: 'Top-tier developers with premium residential projects.' },
  { name: 'Marian Developers', url: 'https://mariandevelopers.com', description: 'Committed to delivering quality homes with transparency.' },
  { name: 'Abish Builders', url: 'https://abishbuilders.com', description: 'Specializing in residential and commercial developments.' },
  { name: 'GB Group', url: 'https://gbgroup.co.in', description: 'Diverse portfolio across residential and infrastructure.' },
  { name: 'Aarnava Builders', url: 'https://aarnavabuilders.com', description: 'Quality residential projects with a focus on modern living.' },
  { name: 'Pranaam Builders', url: 'https://pranaambuilders.com', description: 'Reliable developers offering premium apartments in Mangalore.' },
];

export default function BuilderDirectory() {
  const [selectedBuilder, setSelectedBuilder] = useState<typeof BUILDERS[0] | null>(null);

  return (
    <section className="py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Builder Directory</h2>
            <p className="text-zinc-500">Access official websites and project details directly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUILDERS.map((builder) => (
            <div 
              key={builder.name}
              className="bg-white p-6 rounded-3xl border border-zinc-200 hover:border-emerald-500 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Globe className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => setSelectedBuilder(builder)}
                  className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">{builder.name}</h3>
              <p className="text-sm text-zinc-500 mb-6 line-clamp-2">{builder.description}</p>
              <a 
                href={builder.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Visit Website
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedBuilder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-zinc-900">{selectedBuilder.name}</h3>
                <button onClick={() => setSelectedBuilder(null)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <div className="aspect-video bg-zinc-100 rounded-2xl mb-6 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
                  <Globe className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">Official website will open in a new tab for security and full functionality.</p>
                </div>
                <p className="text-zinc-600 mb-8 leading-relaxed">{selectedBuilder.description}</p>
                <div className="flex gap-4">
                  <a 
                    href={selectedBuilder.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-center hover:bg-emerald-700 transition-all"
                  >
                    Open Official Site
                  </a>
                  <button 
                    onClick={() => setSelectedBuilder(null)}
                    className="px-6 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
