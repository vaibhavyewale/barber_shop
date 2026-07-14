import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection, PageHeader } from '../components/ui/Shared';
import { Scissors, Sparkles, Crown } from 'lucide-react';

interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching services:', err);
        setLoading(false);
      });
  }, []);

  const hairServices = services.filter((s) => s.category.toLowerCase() === 'hair');
  const beardServices = services.filter((s) => s.category.toLowerCase() === 'beard');
  const packageServices = services.filter((s) => s.category.toLowerCase() === 'packages');

  return (
    <div>
      <PageHeader 
        title="Our Services" 
        subtitle="Precision, luxury, and relaxation. Choose from our range of premium grooming services."
        image="https://images.unsplash.com/photo-1593702288056-ccbfb4588e34?q=80&w=1974&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          
          {loading ? (
            <div className="text-center text-text-gray">Loading services...</div>
          ) : (
            <>
              {/* Hair Services */}
              {hairServices.length > 0 && (
                <div className="mb-24">
                  <AnimatedSection className="flex items-center gap-4 mb-12">
                    <Scissors className="w-8 h-8 text-gold" />
                    <h2 className="text-4xl font-bold">Hair Services</h2>
                    <div className="h-px bg-white/10 flex-grow ml-4"></div>
                  </AnimatedSection>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {hairServices.map((service, i) => (
                      <ServiceCard key={service.id || i} service={service} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Beard Services */}
              {beardServices.length > 0 && (
                <div className="mb-24">
                  <AnimatedSection className="flex items-center gap-4 mb-12">
                    <Sparkles className="w-8 h-8 text-gold" />
                    <h2 className="text-4xl font-bold">Beard & Shave</h2>
                    <div className="h-px bg-white/10 flex-grow ml-4"></div>
                  </AnimatedSection>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {beardServices.map((service, i) => (
                      <ServiceCard key={service.id || i} service={service} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Packages */}
              {packageServices.length > 0 && (
                <div>
                  <AnimatedSection className="flex items-center gap-4 mb-12">
                    <Crown className="w-8 h-8 text-gold" />
                    <h2 className="text-4xl font-bold">Premium Packages</h2>
                    <div className="h-px bg-white/10 flex-grow ml-4"></div>
                  </AnimatedSection>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {packageServices.map((service, i) => (
                      <ServiceCard key={service.id || i} service={service} index={i} />
                    ))}
                  </div>
                </div>
              )}
              
              {services.length === 0 && (
                <div className="text-center text-text-gray">No services available right now. Please check back later.</div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service, index: number, key?: string | number }) {
  return (
    <AnimatedSection delay={index * 0.1} className="glass-card p-8 group hover:border-gold/30 transition-all flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-baseline mb-4 border-b border-white/10 pb-4">
          <h3 className="text-2xl font-bold font-heading">{service.name}</h3>
          <span className="text-2xl text-gold font-bold">${service.price}</span>
        </div>
        <p className="text-text-gray mb-6 text-sm">{service.duration} Min</p>
        <p className="text-gray-300 mb-8 leading-relaxed">{service.description}</p>
      </div>
      <Link to="/contact" className="w-full text-center py-3 border border-white/20 uppercase tracking-wider text-sm font-bold hover:bg-gold hover:text-primary hover:border-gold transition-colors block">
        Book Now
      </Link>
    </AnimatedSection>
  );
}

