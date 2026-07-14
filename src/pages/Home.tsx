import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, CheckCircle } from 'lucide-react';
import { AnimatedSection } from '../components/ui/Shared';

interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Show up to 3 services on the home page as featured
          setFeaturedServices(data.slice(0, 3));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop" 
            alt="Barber Shop" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <AnimatedSection>
              <h2 className="text-gold font-bold tracking-widest uppercase mb-4 text-sm md:text-base">
                Premium Men's Grooming
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                Refine Your <br />
                <span className="gold-gradient-text italic">Style.</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg md:text-xl text-text-gray mb-10 max-w-xl">
                Experience the perfect blend of classic barbering traditions and modern styling in a luxury atmosphere.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.3} className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-gold hover:bg-gold-light text-primary px-8 py-4 rounded-sm font-bold uppercase tracking-wider text-center transition-colors">
                Book Appointment
              </Link>
              <Link to="/services" className="border border-white/20 hover:border-gold hover:text-gold bg-black/20 backdrop-blur-sm px-8 py-4 rounded-sm font-bold uppercase tracking-wider text-center transition-colors">
                Our Services
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <AnimatedSection className="max-w-xl">
              <h2 className="text-gold uppercase tracking-widest text-sm font-bold mb-4">Our Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-bold">Premium Services</h3>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="mt-6 md:mt-0">
              <Link to="/services" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors group uppercase tracking-wider text-sm font-bold">
                View All Services 
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.length > 0 ? featuredServices.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.1} className="glass-card p-8 group hover:border-gold/50 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-2xl font-bold font-heading">{service.name}</h4>
                  <span className="text-xl text-gold font-bold">${service.price}</span>
                </div>
                <p className="text-text-gray mb-8">{service.description}</p>
                <div className="w-full h-[1px] bg-white/10 group-hover:bg-gold/30 transition-colors"></div>
              </AnimatedSection>
            )) : (
              <div className="col-span-3 text-center text-text-gray">No services available right now.</div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative h-[600px] rounded-sm overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop" 
                  alt="Barber working" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 border-2 border-gold/20 m-6 pointer-events-none"></div>
              </div>
            </AnimatedSection>
            
            <div>
              <AnimatedSection>
                <h2 className="text-gold uppercase tracking-widest text-sm font-bold mb-4">Why Choose Us</h2>
                <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">The Mark of <br />a <span className="gold-gradient-text italic">Gentleman</span></h3>
                <p className="text-text-gray text-lg mb-10">
                  We believe that a haircut is more than just a service—it's an experience. Our master barbers combine traditional techniques with modern trends.
                </p>
              </AnimatedSection>

              <div className="space-y-6">
                {[
                  { title: 'Master Barbers', desc: 'Decades of combined experience in premium grooming.' },
                  { title: 'Luxury Atmosphere', desc: 'Relax in our vintage chairs with complimentary beverages.' },
                  { title: 'Premium Products', desc: 'We only use top-tier grooming products for your hair and beard.' }
                ].map((item, i) => (
                  <AnimatedSection key={i} delay={0.2 + (i * 0.1)} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-text-gray">{item.desc}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Booking */}
      <section className="py-24 relative flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
            alt="Barber Tools" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to look your best?</h2>
            <p className="text-xl text-text-gray mb-10">Book your appointment today and experience the luxury of a perfect cut.</p>
            <Link to="/contact" className="inline-block bg-gold hover:bg-gold-light text-primary px-10 py-5 rounded-sm font-bold uppercase tracking-wider transition-colors text-lg">
              Book Your Seat
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
