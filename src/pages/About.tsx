import React from 'react';
import { AnimatedSection, PageHeader } from '../components/ui/Shared';
import { Award, Clock, Users, Coffee } from 'lucide-react';

export default function About() {
  return (
    <div>
      <PageHeader 
        title="Our Story" 
        subtitle="Crafting confidence since 2010. Discover the passion behind our premium grooming experience."
        image="https://images.unsplash.com/photo-1520638528994-629676e938cd?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <h2 className="text-gold uppercase tracking-widest text-sm font-bold mb-4">Our Mission</h2>
              <h3 className="text-4xl font-bold mb-6">Elevating the Art of Men's Grooming</h3>
              <p className="text-text-gray text-lg mb-6 leading-relaxed">
                At LuxeCut, we believe that every man deserves a place where he can relax, unwind, and receive unparalleled grooming services. Our mission is to preserve the classic barbershop tradition while integrating modern techniques and premium products.
              </p>
              <p className="text-text-gray text-lg leading-relaxed">
                We're not just cutting hair; we're crafting confidence. Every client who sits in our chair receives a personalized consultation to ensure they leave looking and feeling their absolute best.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop" alt="Barber cutting" className="w-full h-64 object-cover rounded-sm mt-8" referrerPolicy="no-referrer" />
                <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1974&auto=format&fit=crop" alt="Barber shop tools" className="w-full h-64 object-cover rounded-sm" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute inset-0 bg-gold/10 mix-blend-overlay"></div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, stat: '10k+', label: 'Happy Clients' },
              { icon: Award, stat: '15+', label: 'Years Experience' },
              { icon: Coffee, stat: '100%', label: 'Relaxation' },
              { icon: Clock, stat: '24/7', label: 'Online Booking' }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary border border-white/10 flex items-center justify-center rounded-full mb-4">
                  <item.icon className="w-8 h-8 text-gold" />
                </div>
                <h4 className="text-4xl font-bold mb-2 font-heading">{item.stat}</h4>
                <p className="text-text-gray uppercase tracking-wider text-sm">{item.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-gold uppercase tracking-widest text-sm font-bold mb-4">Our History</h2>
            <h3 className="text-4xl md:text-5xl font-bold">The Journey of LuxeCut</h3>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>
            
            {[
              { year: '2010', title: 'The Beginning', desc: 'Opened our first small shop with just two chairs, focusing on classic hot towel shaves.' },
              { year: '2015', title: 'Expanding the Vision', desc: 'Moved to our current luxury location, expanding our team and services.' },
              { year: '2020', title: 'Award Winning', desc: 'Voted "Best Premium Barber Shop" in the city for three consecutive years.' },
              { year: '2026', title: 'Modern Era', desc: 'Continuing to innovate with new premium product lines and exclusive VIP memberships.' }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className={`flex flex-col md:flex-row gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2"></div>
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold hidden md:block mt-6 box-content border-4 border-primary"></div>
                <div className={`md:w-1/2 glass-card p-8 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                  <span className="text-gold font-bold text-xl mb-2 block">{item.year}</span>
                  <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                  <p className="text-text-gray">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
