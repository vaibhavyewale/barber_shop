import { motion } from 'motion/react';
import React from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  key?: React.Key;
}

export function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageHeader({ title, subtitle, image }: { title: string, subtitle?: string, image?: string }) {
  return (
    <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center overflow-hidden">
      {image && (
        <>
          <div className="absolute inset-0 z-0">
            <img src={image} alt={title} className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary"></div>
        </>
      )}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4 gold-gradient-text"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-gray max-w-2xl mx-auto text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
