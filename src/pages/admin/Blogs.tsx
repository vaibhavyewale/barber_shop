import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  image_url: string;
  created_at: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Blog>();

  const fetchBlogs = () => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog: Blog) => {
    setIsAdding(true);
    setEditingId(blog.id);
    setFormError(null);
    Object.keys(blog).forEach((key) => {
      setValue(key as keyof Blog, blog[key as keyof Blog]);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
    setFormError(null);
  };

  const onSubmit = async (data: Blog) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      };

      const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs';
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
        fetchBlogs();
      } else {
        const errData = await res.json();
        if (errData.details && errData.details.includes('row-level security')) {
          setFormError('Supabase RLS Error: Please disable Row Level Security (RLS) or add an policy for the "blogs" table in your Supabase dashboard.');
        } else {
          setFormError('Failed to save blog post.');
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
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBlogs();
      } else {
        alert('Failed to delete blog post.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Blog Posts</h2>
        <button 
          onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
          className="bg-gold hover:bg-gold-light text-primary px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {isAdding ? 'Cancel' : 'Create Post'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-secondary p-6 rounded-sm border border-white/5 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Post' : 'Create New Post'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Title</label>
                <input {...register('title')} required className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Category</label>
                <input {...register('category')} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Image URL</label>
                <input {...register('image_url')} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Content</label>
                <textarea {...register('content')} required rows={10} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold resize-none" />
              </div>
            </div>
            {formError && <div className="text-red-400 text-sm mt-2">{formError}</div>}
            <button disabled={isSubmitting} type="submit" className="bg-gold text-primary px-6 py-3 font-bold uppercase text-sm mt-4 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Post'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-secondary rounded-sm border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 text-text-gray text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Post</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-text-gray">
                  No blog posts found. Click "Create Post" to get started.
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    {blog.image_url ? (
                      <img src={blog.image_url} alt={blog.title} className="w-12 h-10 rounded-sm object-cover" />
                    ) : (
                      <div className="w-12 h-10 rounded-sm bg-white/5 flex items-center justify-center text-xs">IMG</div>
                    )}
                    <div>
                      {blog.title}
                      <p className="text-xs text-text-gray font-normal">/{blog.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-gray">
                    <span className="bg-white/10 px-2 py-1 rounded-sm text-xs">{blog.category || 'General'}</span>
                  </td>
                  <td className="px-6 py-4 text-text-gray text-sm">
                    {new Date(blog.created_at || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3 items-center h-full mt-1">
                    <button onClick={() => handleEdit(blog)} className="text-blue-400 hover:text-blue-300"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(blog.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
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
