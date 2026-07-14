import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Barber {
  id: string;
  name: string;
  experience: string;
  specialization: string;
  image_url: string;
}

export default function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Barber>();

  const fetchBarbers = () => {
    fetch('/api/barbers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBarbers(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const handleEdit = (barber: Barber) => {
    setIsAdding(true);
    setEditingId(barber.id);
    setFormError(null);
    Object.keys(barber).forEach((key) => {
      setValue(key as keyof Barber, barber[key as keyof Barber]);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
    setFormError(null);
  };

  const onSubmit = async (data: Barber) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/barbers/${editingId}` : '/api/barbers';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        reset();
        fetchBarbers();
      } else {
        const errData = await res.json();
        if (errData.details && errData.details.includes('row-level security')) {
          setFormError('Supabase RLS Error: Please disable Row Level Security (RLS) or add an policy for the "barbers" table in your Supabase dashboard.');
        } else {
          setFormError('Failed to save barber.');
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
    if (!confirm('Are you sure you want to delete this barber?')) return;
    try {
      const res = await fetch(`/api/barbers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBarbers();
      } else {
        const errData = await res.json();
        if (errData.details && errData.details.includes('row-level security')) {
            alert('Supabase RLS Error: Please disable Row Level Security (RLS) or add a DELETE policy for the "barbers" table in your Supabase dashboard.');
        } else {
            alert('Failed to delete barber.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Barbers Management</h2>
        <button 
          onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
          className="bg-gold hover:bg-gold-light text-primary px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {isAdding ? 'Cancel' : 'Add Barber'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-secondary p-6 rounded-sm border border-white/5 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Barber' : 'Add New Barber'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Name</label>
                <input {...register('name')} required className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Experience</label>
                <input {...register('experience')} placeholder="e.g. 5 Years" className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Specialization</label>
                <input {...register('specialization')} placeholder="e.g. Skin Fades" className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Image URL</label>
                <input {...register('image_url')} placeholder="https://..." className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
            </div>
            {formError && <div className="text-red-400 text-sm mt-2">{formError}</div>}
            <button disabled={isSubmitting} type="submit" className="bg-gold text-primary px-6 py-3 font-bold uppercase text-sm mt-4 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Barber'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-secondary rounded-sm border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 text-text-gray text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Barber</th>
              <th className="px-6 py-4 font-bold">Experience</th>
              <th className="px-6 py-4 font-bold">Specialization</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {barbers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-text-gray">
                  No barbers found. Click "Add Barber" to get started.
                </td>
              </tr>
            ) : (
              barbers.map((barber) => (
                <tr key={barber.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    {barber.image_url ? (
                      <img src={barber.image_url} alt={barber.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                        {barber.name.charAt(0)}
                      </div>
                    )}
                    {barber.name}
                  </td>
                  <td className="px-6 py-4 text-text-gray">{barber.experience || '-'}</td>
                  <td className="px-6 py-4">{barber.specialization || '-'}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(barber)} className="text-blue-400 hover:text-blue-300"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(barber.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
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
