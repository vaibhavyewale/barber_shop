import React from 'react';
import { AnimatedSection, PageHeader } from '../components/ui/Shared';
import { Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const TEAM = [
  {
    name: 'Marcus Vance',
    role: 'Master Barber & Founder',
    exp: '18 Years Experience',
    img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop',
    specialty: 'Classic Cuts & Hot Towel Shaves'
  },
  {
    name: 'Julian Reyes',
    role: 'Senior Barber',
    exp: '12 Years Experience',
    img: 'https://images.unsplash.com/photo-1582239457632-411bd0175b92?q=80&w=2072&auto=format&fit=crop',
    specialty: 'Skin Fades & Modern Styling'
  },
  {
    name: 'David Chen',
    role: 'Beard Specialist',
    exp: '9 Years Experience',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop',
    specialty: 'Beard Sculpting & Grooming'
  },
  {
    name: 'Thomas Wright',
    role: 'Barber',
    exp: '5 Years Experience',
    img: 'https://images.unsplash.com/photo-1534079822699-e65b1db3bcf3?q=80&w=2069&auto=format&fit=crop',
    specialty: 'Taper Fades & Texture'
  }
];

export default function Team() {
  return (
    <div>
      <PageHeader 
        title="Meet Our Team" 
        subtitle="The master craftsmen behind every perfect cut."
        image="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {TEAM.map((member, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="group">
                <div className="relative overflow-hidden mb-6 aspect-[3/4]">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                    <div className="flex gap-4 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      <a href="#" className="w-10 h-10 rounded-full bg-gold/90 text-primary flex items-center justify-center hover:bg-gold transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-gold/90 text-primary flex items-center justify-center hover:bg-gold transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold font-heading mb-1 group-hover:text-gold transition-colors">{member.name}</h3>
                <p className="text-gold font-medium mb-3 uppercase tracking-wider text-sm">{member.role}</p>
                <div className="text-text-gray text-sm space-y-1 mb-6">
                  <p>{member.exp}</p>
                  <p>Specialty: <span className="text-white">{member.specialty}</span></p>
                </div>
                <Link to="/contact" className="inline-block border-b border-gold text-gold uppercase tracking-widest text-xs font-bold pb-1 hover:text-white hover:border-white transition-colors">
                  Book {member.name.split(' ')[0]}
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
