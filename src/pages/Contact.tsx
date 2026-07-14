import React, { useState, useEffect } from 'react';
import { AnimatedSection, PageHeader } from '../components/ui/Shared';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const bookingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().optional()
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [services, setServices] = useState<{id: string, name: string}[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(console.error);
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        const errData = await response.json();
        if (errData.details && errData.details.includes('row-level security')) {
          setFormError('Supabase RLS Error: Please disable Row Level Security (RLS) or add an INSERT policy for the "appointments" table in your Supabase dashboard.');
        } else {
          setFormError('An error occurred while booking. Please try again.');
        }
      }
    } catch (error) {
      console.error("Booking error:", error);
      setFormError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Contact & Booking" 
        subtitle="Ready to elevate your style? Get in touch or book your appointment online."
      />

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <AnimatedSection>
              <h2 className="text-3xl font-bold font-heading mb-8">Get In Touch</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Location</h4>
                    <p className="text-text-gray">123 Luxury Avenue<br />Downtown District<br />New York, NY 10012</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Phone</h4>
                    <p className="text-text-gray">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Email</h4>
                    <p className="text-text-gray">info@luxecut.com</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold" /> Opening Hours
                </h4>
                <ul className="space-y-3 text-text-gray">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Monday - Friday</span>
                    <span className="text-gold">9:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Saturday</span>
                    <span className="text-gold">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-gold">10:00 AM - 4:00 PM</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.2}>
              <div className="glass-card p-8 md:p-10">
                <h2 className="text-3xl font-bold font-heading mb-2">Book Appointment</h2>
                <p className="text-text-gray mb-8">Schedule your visit with our master barbers.</p>
                
                {isSuccess ? (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-sm flex flex-col items-center text-center space-y-4">
                    <CheckCircle className="w-12 h-12" />
                    <div>
                      <h4 className="text-xl font-bold mb-2">Booking Requested</h4>
                      <p>We've received your appointment request and will contact you shortly to confirm the exact time.</p>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-300">First Name</label>
                        <input {...register("firstName")} type="text" className="w-full bg-primary border border-white/10 p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="John" />
                        {errors.firstName && <span className="text-red-400 text-xs">{errors.firstName.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-300">Last Name</label>
                        <input {...register("lastName")} type="text" className="w-full bg-primary border border-white/10 p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="Doe" />
                        {errors.lastName && <span className="text-red-400 text-xs">{errors.lastName.message}</span>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-gray-300">Email Address</label>
                      <input {...register("email")} type="email" className="w-full bg-primary border border-white/10 p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="john@example.com" />
                      {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-gray-300">Service Interest</label>
                      <select {...register("service")} className="w-full bg-primary border border-white/10 p-4 text-white focus:outline-none focus:border-gold transition-colors appearance-none">
                        <option value="">Select a service</option>
                        {services.length > 0 ? (
                          services.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="Haircut">Haircut</option>
                            <option value="Beard Trim">Beard Trim</option>
                            <option value="Hot Towel Shave">Hot Towel Shave</option>
                            <option value="Premium Package">Premium Package</option>
                          </>
                        )}
                      </select>
                      {errors.service && <span className="text-red-400 text-xs">{errors.service.message}</span>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-gray-300">Message (Optional)</label>
                      <textarea {...register("message")} rows={4} className="w-full bg-primary border border-white/10 p-4 text-white focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Any specific requests or preferred barber?"></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gold hover:bg-gold-light disabled:opacity-50 text-primary py-4 font-bold uppercase tracking-wider transition-colors mt-4"
                    >
                      {isSubmitting ? 'Submitting...' : 'Book Appointment'}
                    </button>
                    {formError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm text-sm">
                        {formError}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-24 bg-secondary relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection>
            <div className="glass-card p-8 md:p-12">
              <h2 className="text-3xl font-bold font-heading mb-2 text-center">Send Us a Message</h2>
              <p className="text-text-gray mb-8 text-center">Have questions? We'd love to hear from you.</p>
              
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(5, "Message is required")
});

type ContactFormValues = z.infer<typeof contactSchema>;

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        const errData = await response.json();
        if (errData.details && errData.details.includes('row-level security')) {
          setFormError('Supabase RLS Error: Please add an INSERT policy for the "contacts" table.');
        } else {
          setFormError('An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error("Contact error:", error);
      setFormError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-sm flex flex-col items-center text-center space-y-4">
        <CheckCircle className="w-12 h-12" />
        <div>
          <h4 className="text-xl font-bold mb-2">Message Sent</h4>
          <p>We've received your message and will get back to you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-300">Name</label>
          <input {...register("name")} type="text" className="w-full bg-primary border border-white/10 p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="Your Name" />
          {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-300">Email Address</label>
          <input {...register("email")} type="email" className="w-full bg-primary border border-white/10 p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="you@example.com" />
          {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-bold uppercase tracking-wider text-gray-300">Subject</label>
        <input {...register("subject")} type="text" className="w-full bg-primary border border-white/10 p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="How can we help?" />
        {errors.subject && <span className="text-red-400 text-xs">{errors.subject.message}</span>}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-bold uppercase tracking-wider text-gray-300">Message</label>
        <textarea {...register("message")} rows={5} className="w-full bg-primary border border-white/10 p-4 text-white focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Your message here..."></textarea>
        {errors.message && <span className="text-red-400 text-xs">{errors.message.message}</span>}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gold hover:bg-gold-light disabled:opacity-50 text-primary py-4 font-bold uppercase tracking-wider transition-colors mt-4"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      {formError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm text-sm">
          {formError}
        </div>
      )}
    </form>
  );
}
