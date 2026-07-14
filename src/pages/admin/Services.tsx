import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';

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
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Service>();

  const fetchServices = () => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setIsAdding(true);
    setEditingId(service.id);
    setFormError(null);
    Object.keys(service).forEach((key) => {
      setValue(key as keyof Service, service[key as keyof Service]);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
    setFormError(null);
  };

  const onSubmit = async (data: Service) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        duration: parseInt(data.duration as unknown as string, 10),
        price: parseFloat(data.price as unknown as string)
      };

      const url = editingId ? `/api/services/${editingId}` : '/api/services';
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
        fetchServices();
      } else {
        const errData = await res.json();
        if (errData.details && errData.details.includes('row-level security')) {
          setFormError('Supabase RLS Error: Please disable Row Level Security (RLS) or add an policy for the "services" table in your Supabase dashboard.');
        } else {
          setFormError('Failed to save service.');
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
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchServices();
      } else {
        alert('Failed to delete service.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Services Management</h2>
        <button 
          onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
          className="bg-gold hover:bg-gold-light text-primary px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {isAdding ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-secondary p-6 rounded-sm border border-white/5 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Category</label>
                <select {...register('category')} required className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold">
                  <option value="Hair">Hair</option>
                  <option value="Beard">Beard</option>
                  <option value="Packages">Packages</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Service Name</label>
                <input {...register('name')} required placeholder="e.g. Skin Fade" className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Description</label>
                <input {...register('description')} placeholder="e.g. Classic fade down to the skin" className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Duration (mins)</label>
                <input type="number" {...register('duration')} required placeholder="e.g. 45" className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Price ($)</label>
                <input type="number" step="0.01" {...register('price')} required placeholder="e.g. 35.00" className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
            </div>
            {formError && <div className="text-red-400 text-sm mt-2">{formError}</div>}
            <button disabled={isSubmitting} type="submit" className="bg-gold text-primary px-6 py-3 font-bold uppercase text-sm mt-4 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Service'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-secondary rounded-sm border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 text-text-gray text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Service</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Duration</th>
              <th className="px-6 py-4 font-bold">Price</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-gray">
                  No services found. Click "Add Service" to get started.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {service.name}
                    {service.description && <p className="text-xs text-text-gray font-normal mt-1">{service.description}</p>}
                  </td>
                  <td className="px-6 py-4 text-text-gray">
                    <span className="bg-white/10 px-2 py-1 rounded-sm text-xs">{service.category}</span>
                  </td>
                  <td className="px-6 py-4 text-text-gray">{service.duration} mins</td>
                  <td className="px-6 py-4 font-bold text-gold">${service.price}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3 items-center h-full">
                    <button onClick={() => handleEdit(service)} className="text-blue-400 hover:text-blue-300 mt-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(service.id)} className="text-red-400 hover:text-red-300 mt-2"><Trash2 className="w-4 h-4" /></button>
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
