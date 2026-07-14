import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Product>();

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setIsAdding(true);
    setEditingId(product.id);
    setFormError(null);
    Object.keys(product).forEach((key) => {
      setValue(key as keyof Product, product[key as keyof Product]);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
    setFormError(null);
  };

  const onSubmit = async (data: Product) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price as unknown as string),
        stock: parseInt(data.stock as unknown as string, 10)
      };

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
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
        fetchProducts();
      } else {
        const errData = await res.json();
        if (errData.details && errData.details.includes('row-level security')) {
          setFormError('Supabase RLS Error: Please disable Row Level Security (RLS) or add an policy for the "products" table in your Supabase dashboard.');
        } else {
          setFormError('Failed to save product.');
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
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Product Inventory</h2>
        <button 
          onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
          className="bg-gold hover:bg-gold-light text-primary px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {isAdding ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-secondary p-6 rounded-sm border border-white/5 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Product Name</label>
                <input {...register('name')} required className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Category</label>
                <input {...register('category')} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Price ($)</label>
                <input type="number" step="0.01" {...register('price')} required className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Stock Quantity</label>
                <input type="number" {...register('stock')} required className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Description</label>
                <textarea {...register('description')} rows={3} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Image URL</label>
                <input {...register('image_url')} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
            </div>
            {formError && <div className="text-red-400 text-sm mt-2">{formError}</div>}
            <button disabled={isSubmitting} type="submit" className="bg-gold text-primary px-6 py-3 font-bold uppercase text-sm mt-4 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-secondary rounded-sm border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 text-text-gray text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Product</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Price</th>
              <th className="px-6 py-4 font-bold">Stock</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-gray">
                  No products found in inventory. Click "Add Product" to get started.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-sm object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center text-xs">IMG</div>
                    )}
                    <div>
                      {product.name}
                      {product.description && <p className="text-xs text-text-gray font-normal truncate max-w-[200px]">{product.description}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-gray">{product.category || '-'}</td>
                  <td className="px-6 py-4 text-gold font-bold">${product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-sm text-xs ${product.stock > 10 ? 'bg-green-500/10 text-green-400' : product.stock > 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3 h-full items-center mt-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
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
