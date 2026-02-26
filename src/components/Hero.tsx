import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin, Globe, Search } from 'lucide-react';

export default function Hero({ onSearch }: { onSearch?: (query: string) => void }) {
  const [query, setQuery] = React.useState('');

  const handleSearch = () => {
    onSearch?.(query);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#ecfdf5,transparent_70%)]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-6"
          >
            <Globe className="w-3.5 h-3.5" />
            Trusted by 500+ NRI Investors Worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6"
          >
            Secure <span className="text-orange-500">High-Yield Assets</span> in India's Emerging Silicon Beach
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 mb-10 leading-relaxed"
          >
            Professional real estate investment advisory for NRIs and local investors. Access RERA-verified properties near Derebail IT Park with guaranteed transparency and zero hidden costs.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch?.(e.target.value);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search IT Park vicinity, luxury villas, or high-ROI properties..."
                className="w-full pl-12 pr-16 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-900"
              />
              <AnimatePresence>
                {query.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transform hover:scale-105">
              View High-Yield Assets
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-blue-900 rounded-2xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-blue-900" />
              IT Park Proximity Map
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
