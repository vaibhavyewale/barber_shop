import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface GalleryItem {
  id: string;
  category: string;
  image_url: string;
  caption: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<GalleryItem>();

  const fetchItems = () => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: GalleryItem) => {
    setIsAdding(true);
    setEditingId(item.id);
    setFormError(null);
    Object.keys(item).forEach((key) => {
      setValue(key as keyof GalleryItem, item[key as keyof GalleryItem]);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
    setFormError(null);
  };

  const onSubmit = async (data: GalleryItem) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery';
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
        fetchItems();
      } else {
        const errData = await res.json();
        if (errData.details && errData.details.includes('row-level security')) {
          setFormError('Supabase RLS Error: Please disable Row Level Security (RLS) or add an policy for the "gallery" table in your Supabase dashboard.');
        } else {
          setFormError('Failed to save gallery item.');
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
    if (!confirm('Are you sure you want to delete this media?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems();
      } else {
        alert('Failed to delete media.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Gallery Management</h2>
        <button 
          onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
          className="bg-gold hover:bg-gold-light text-primary px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {isAdding ? 'Cancel' : 'Upload Media'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-secondary p-6 rounded-sm border border-white/5 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Media' : 'Add New Media'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Category</label>
                <select {...register('category')} required className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold">
                  <option value="Haircuts">Haircuts</option>
                  <option value="Shop Interior">Shop Interior</option>
                  <option value="Events">Events</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Image URL</label>
                <input {...register('image_url')} required placeholder="https://..." className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Caption (Optional)</label>
                <input {...register('caption')} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
            </div>
            {formError && <div className="text-red-400 text-sm mt-2">{formError}</div>}
            <button disabled={isSubmitting} type="submit" className="bg-gold text-primary px-6 py-3 font-bold uppercase text-sm mt-4 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Media'}
            </button>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-secondary rounded-sm border border-white/5 p-8 text-center text-text-gray">
          <p>No media found in the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group bg-secondary border border-white/5 rounded-sm overflow-hidden relative">
              <img src={item.image_url} alt={item.caption || item.category} className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="p-4 bg-black/50 absolute bottom-0 left-0 right-0">
                <p className="font-bold text-sm">{item.category}</p>
                {item.caption && <p className="text-xs text-gray-300 truncate">{item.caption}</p>}
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(item)} className="bg-blue-500/80 text-white p-2 rounded-full hover:bg-blue-500"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
