import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Testimonial>();

  const fetchTestimonials = () => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTestimonials(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (testimonial: Testimonial) => {
    setIsAdding(true);
    setEditingId(testimonial.id);
    setFormError(null);
    Object.keys(testimonial).forEach((key) => {
      setValue(key as keyof Testimonial, testimonial[key as keyof Testimonial]);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
    setFormError(null);
  };

  const onSubmit = async (data: Testimonial) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        rating: parseInt(data.rating as unknown as string, 10)
      };

      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        reset();
        fetchTestimonials();
      } else {
        const errData = await res.json();
        if (errData.details && errData.details.includes('row-level security')) {
          setFormError('Supabase RLS Error: Please disable Row Level Security (RLS) or add an policy for the "testimonials" table in your Supabase dashboard.');
        } else {
          setFormError('Failed to save testimonial.');
        }
      }
    } catch (err) {
      console.error(err);
      setFormError('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTestimonials();
      } else {
        alert('Failed to delete testimonial.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Testimonials Management</h2>
        <button 
          onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
          className="bg-gold hover:bg-gold-light text-primary px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {isAdding ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-secondary p-6 rounded-sm border border-white/5 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Customer Name</label>
                <input {...register('name')} required className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Role/Title</label>
                <input {...register('role')} placeholder="e.g. Regular Client" className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Rating (1-5)</label>
                <input type="number" min="1" max="5" {...register('rating')} required className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Review Content</label>
                <textarea {...register('content')} required rows={3} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold resize-none" />
              </div>
            </div>
            {formError && <div className="text-red-400 text-sm mt-2">{formError}</div>}
            <button disabled={isSubmitting} type="submit" className="bg-gold text-primary px-6 py-3 font-bold uppercase text-sm mt-4 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Testimonial'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-secondary rounded-sm border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 text-text-gray text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Customer</th>
              <th className="px-6 py-4 font-bold">Rating</th>
              <th className="px-6 py-4 font-bold">Review</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-text-gray">
                  No testimonials found. Click "Add Testimonial" to get started.
                </td>
              </tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {testimonial.name}
                    {testimonial.role && <p className="text-xs text-text-gray font-normal mt-1">{testimonial.role}</p>}
                  </td>
                  <td className="px-6 py-4 text-gold">
                    {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                  </td>
                  <td className="px-6 py-4 text-text-gray max-w-xs truncate">{testimonial.content}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3 items-center h-full">
                    <button onClick={() => handleEdit(testimonial)} className="text-blue-400 hover:text-blue-300 mt-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(testimonial.id)} className="text-red-400 hover:text-red-300 mt-2"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
