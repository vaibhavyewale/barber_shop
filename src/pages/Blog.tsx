import React from 'react';
import { AnimatedSection, PageHeader } from '../components/ui/Shared';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const POSTS = [
  {
    title: 'The Evolution of the Classic Pompadour',
    date: 'Oct 15, 2026',
    author: 'Marcus Vance',
    category: 'Style Guide',
    img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop',
    excerpt: 'Explore how the pompadour has evolved from its vintage roots to modern variations that suit every face shape.'
  },
  {
    title: 'Essential Beard Care Routine for Winter',
    date: 'Nov 02, 2026',
    author: 'David Chen',
    category: 'Grooming',
    img: 'https://images.unsplash.com/photo-1621644782012-c9a7fcb80267?q=80&w=1964&auto=format&fit=crop',
    excerpt: 'Cold weather can be harsh on your facial hair. Discover the top oils and routines to keep your beard healthy during winter.'
  },
  {
    title: 'Why You Should Try a Hot Towel Shave',
    date: 'Nov 18, 2026',
    author: 'Julian Reyes',
    category: 'Services',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop',
    excerpt: 'Beyond just a close shave, learn about the skin benefits and relaxation a traditional hot towel shave provides.'
  }
];

export default function Blog() {
  return (
    <div>
      <PageHeader 
        title="Grooming Journal" 
        subtitle="Tips, trends, and news from the world of premium men's grooming."
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="glass-card group overflow-hidden flex flex-col h-full">
                <div className="relative h-64 overflow-hidden">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-text-gray uppercase tracking-wider mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold font-heading mb-4 group-hover:text-gold transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-gray-300 mb-8 flex-grow">{post.excerpt}</p>
                  
                  <Link to="#" className="inline-flex items-center gap-2 text-gold hover:text-gold-light uppercase text-sm font-bold tracking-wider group-hover:gap-4 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
