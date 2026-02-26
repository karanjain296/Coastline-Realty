import React from 'react';
import { ExternalLink, Flame, MapPin, Building2, Calendar, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

const HOT_PROJECTS = [
  {
    name: 'Altura',
    builder: 'Land Trades',
    location: 'Bendoorwell',
    status: 'Ready to Occupy',
    url: 'https://www.landtrades.in/altura-apartments-in-bendoorwell-mangalore.php',
    image: 'https://picsum.photos/seed/altura/1200/800'
  },
  {
    name: 'Solitaire',
    builder: 'Land Trades',
    location: 'Hat Hill',
    status: 'Ready to Occupy',
    url: 'https://www.landtrades.in/solitaire-apartments-in-hat-hill-mangalore.php',
    image: 'https://picsum.photos/seed/solitaire/1200/800'
  },
  {
    name: 'Rohan City',
    builder: 'Rohan Corporation',
    location: 'Bejai',
    status: 'Under Construction',
    url: 'https://rohancorporation.in/rohan-city.php',
    image: 'https://picsum.photos/seed/rohancity/1200/800'
  },
  {
    name: 'Inland Sunlight Moonlight',
    builder: 'Inland Builders',
    location: 'Kulshekar',
    status: 'Ready to Occupy',
    url: 'https://www.inlandbuilders.com/inland-sunlight-moonlight-apartments-kulshekar-mangalore',
    image: 'https://picsum.photos/seed/inland/1200/800'
  },
  {
    name: 'Northern Sky City',
    builder: 'Northern Sky',
    location: 'Pumpwell',
    status: 'Ready to Occupy',
    url: 'https://northernsky.in/projects/northern-sky-city/',
    image: 'https://picsum.photos/seed/northernsky/1200/800'
  },
  {
    name: 'Prestige Valley Crest',
    builder: 'Prestige Group',
    location: 'Bejai',
    status: 'Ready to Occupy',
    url: 'https://www.prestigeconstructions.com/projects/prestige-valley-crest/',
    image: 'https://picsum.photos/seed/prestige/1200/800'
  }
];

export default function HotProjects({ onImageClick }: { onImageClick?: (images: string[]) => void }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4" />
              Hot for Sale
            </div>
            <h2 className="text-3xl font-bold text-zinc-900">Trending Projects</h2>
            <p className="text-zinc-500">Ready to occupy and upcoming landmarks in Mangalore.</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-emerald-600 font-bold hover:underline">
            View All Projects
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HOT_PROJECTS.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-zinc-50 rounded-[32px] overflow-hidden border border-zinc-100 hover:shadow-xl transition-all"
            >
              <div 
                className="aspect-[16/10] relative overflow-hidden cursor-pointer"
                onClick={() => onImageClick?.([project.image])}
              >
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  View Image
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    project.status === 'Ready to Occupy' ? 'bg-emerald-500/90 text-white' : 'bg-orange-500/90 text-white'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  {project.builder}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{project.name}</h3>
                <div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-6">
                  <MapPin className="w-4 h-4" />
                  {project.location}, Mangalore
                </div>
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
                >
                  View Project Details
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
