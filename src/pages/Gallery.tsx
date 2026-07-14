import React, { useState } from 'react';
import { AnimatedSection, PageHeader } from '../components/ui/Shared';
import { X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['All', 'Haircuts', 'Beards', 'Interior', 'Before/After'];

const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop', category: 'Haircuts' },
  { src: 'https://images.unsplash.com/photo-1621644782012-c9a7fcb80267?q=80&w=1964&auto=format&fit=crop', category: 'Beards' },
  { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop', category: 'Interior' },
  { src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1974&auto=format&fit=crop', category: 'Haircuts' },
  { src: 'https://images.unsplash.com/photo-1534079822699-e65b1db3bcf3?q=80&w=2069&auto=format&fit=crop', category: 'Before/After' },
  { src: 'https://images.unsplash.com/photo-1593702288056-ccbfb4588e34?q=80&w=1974&auto=format&fit=crop', category: 'Interior' },
  { src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop', category: 'Beards' },
  { src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop', category: 'Interior' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filteredImages = activeCategory === 'All' 
    ? IMAGES 
    : IMAGES.filter(img => img.category === activeCategory);

  return (
    <div>
      <PageHeader 
        title="Gallery" 
        subtitle="A look inside our work and the luxury environment we provide."
        image="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full uppercase tracking-wider text-xs font-bold transition-colors ${
                  activeCategory === cat 
                    ? 'bg-gold text-primary' 
                    : 'bg-white/5 text-text-gray hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredImages.map((img, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={i}
                  className="relative group overflow-hidden rounded-sm break-inside-avoid cursor-pointer"
                  onClick={() => setLightboxImg(img.src)}
                >
                  <img src={img.src} alt={`Gallery ${i}`} className="w-full h-auto transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="w-10 h-10 text-gold" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setLightboxImg(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setLightboxImg(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={lightboxImg} 
              alt="Lightbox" 
              className="max-w-full max-h-[90vh] object-contain shadow-2xl shadow-black"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
