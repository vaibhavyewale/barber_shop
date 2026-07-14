import React from 'react';
import { AnimatedSection, PageHeader } from '../components/ui/Shared';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'James Harrison',
    role: 'CEO, TechCorp',
    text: 'The best barber experience I\'ve ever had. The attention to detail is unmatched, and the atmosphere is pure luxury. Marcus is a true master of his craft.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop'
  },
  {
    name: 'Michael Chang',
    role: 'Architect',
    text: 'I\'ve been looking for a barber who understands Asian hair, and Julian delivered perfectly. The hot towel shave is an absolute must-try. Highly recommended.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop'
  },
  {
    name: 'Robert Davis',
    role: 'Local Resident',
    text: 'Not just a haircut, but a complete relaxing experience. The shop is impeccably clean, the whiskey is good, and the service is even better.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
  },
  {
    name: 'Alex Thompson',
    role: 'Fitness Coach',
    text: 'Consistent quality every single time. They know exactly how I like my fade, and the beard trim is always precise. LuxeCut sets the standard.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1974&auto=format&fit=crop'
  }
];

export default function Testimonials() {
  return (
    <div>
      <PageHeader 
        title="Client Reviews" 
        subtitle="Don't just take our word for it. Hear what our clients have to say."
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {TESTIMONIALS.map((review, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="glass-card p-8 md:p-10 relative">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5 rotate-180" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>
                
                <p className="text-lg text-gray-300 italic mb-8 relative z-10 leading-relaxed">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <img src={review.img} alt={review.name} className="w-14 h-14 rounded-full object-cover grayscale border-2 border-gold/50" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-white font-heading text-lg">{review.name}</h4>
                    <p className="text-text-gray text-sm uppercase tracking-wider">{review.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
