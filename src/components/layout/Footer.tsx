import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { NAV_LINKS } from '../../data/constants';

export default function Footer() {
  return (
    <footer className="bg-secondary pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-20"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Scissors className="w-8 h-8 text-gold" />
              <span className="text-2xl font-heading font-bold tracking-wider text-white">
                LUXE<span className="text-gold">CUT</span>
              </span>
            </Link>
            <p className="text-text-gray mb-6 leading-relaxed">
              Experience the pinnacle of men's grooming. Where classic techniques meet modern style in a premium luxury atmosphere.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-gray hover:text-gold hover:bg-white/10 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 text-white">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-text-gray hover:text-gold transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 text-white">Working Hours</h4>
            <ul className="flex flex-col gap-3 text-text-gray">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Mon - Fri</span>
                <span className="text-gold">9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Saturday</span>
                <span className="text-gold">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Sunday</span>
                <span className="text-gold">10:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 text-white">Newsletter</h4>
            <p className="text-text-gray mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-primary border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors w-full"
              />
              <button className="bg-gold hover:bg-gold-light text-primary font-bold uppercase tracking-wider py-3 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-gray text-sm">
            &copy; {new Date().getFullYear()} LuxeCut Barber Shop. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-text-gray">
            <Link to="#" className="hover:text-gold">Privacy Policy</Link>
            <Link to="#" className="hover:text-gold">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
