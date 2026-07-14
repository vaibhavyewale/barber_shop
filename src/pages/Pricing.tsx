import React from 'react';
import { AnimatedSection, PageHeader } from '../components/ui/Shared';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRICING = [
  {
    title: 'The Classic',
    price: '$45',
    desc: 'Perfect for regular maintenance.',
    features: ['Consultation', 'Precision Haircut', 'Neck Shave', 'Styling'],
    popular: false
  },
  {
    title: 'The Premium',
    price: '$75',
    desc: 'Our most popular combination.',
    features: ['Consultation', 'Precision Haircut', 'Beard Trim/Shave', 'Hot Towel', 'Styling'],
    popular: true
  },
  {
    title: 'The Royal',
    price: '$120',
    desc: 'The ultimate relaxation package.',
    features: ['Haircut & Beard Trim', 'Hot Towel Shave', 'Facial Massage', 'Waxing (Nose/Ears)', 'Premium Drink'],
    popular: false
  }
];

export default function Pricing() {
  return (
    <div>
      <PageHeader 
        title="Pricing Plans" 
        subtitle="Transparent pricing for premium services."
      />

      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING.map((plan, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className={`glass-card p-10 relative flex flex-col ${plan.popular ? 'border-gold shadow-lg shadow-gold/10 scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-primary px-4 py-1 font-bold text-xs uppercase tracking-widest rounded-sm">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold font-heading mb-2 text-center">{plan.title}</h3>
                <p className="text-text-gray text-center mb-8 h-10">{plan.desc}</p>
                
                <div className="text-center mb-8">
                  <span className="text-5xl font-bold text-gold">{plan.price}</span>
                </div>
                
                <div className="h-px w-full bg-white/10 mb-8"></div>
                
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gold shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/contact" className={`w-full text-center py-4 rounded-sm font-bold uppercase tracking-wider text-sm transition-colors ${
                  plan.popular 
                    ? 'bg-gold hover:bg-gold-light text-primary' 
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}>
                  Book Now
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
