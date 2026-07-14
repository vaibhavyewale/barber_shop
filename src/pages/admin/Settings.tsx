import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<any>();

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSettings(data);
          data.forEach((setting: Setting) => {
            setValue(setting.setting_key, JSON.stringify(setting.setting_value));
          });
        }
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onSubmit = async (data: any) => {
    setFormError(null);
    setIsSuccess(false);
    try {
      // Very basic settings update (deleting all and re-inserting)
      await Promise.all(settings.map(s => fetch(`/api/settings/${s.id}`, { method: 'DELETE' })));
      
      const promises = Object.entries(data).map(([key, value]) => {
        if (!value) return Promise.resolve();
        let parsedValue = value;
        try { parsedValue = JSON.parse(value as string); } catch (e) {}
        
        return fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setting_key: key, setting_value: parsedValue })
        });
      });
      
      const results = await Promise.all(promises);
      const hasErrors = results.some(r => r && !r.ok);
      
      if (hasErrors) {
        setFormError('Some settings failed to save (check RLS permissions).');
      } else {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }
      fetchSettings();
    } catch (err) {
      console.error(err);
      setFormError('Network error.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Website Settings</h2>
      </div>

      <div className="bg-secondary rounded-sm border border-white/5 p-8">
        {isSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-sm mb-6 text-sm">
            Settings saved successfully!
          </div>
        )}
        {formError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm mb-6 text-sm">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Shop Name</label>
              <input {...register('shop_name')} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" placeholder='"Luxe Barbershop"' />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Contact Email</label>
              <input {...register('contact_email')} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" placeholder='"info@luxecut.com"' />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Currency Symbol</label>
              <input {...register('currency_symbol')} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" placeholder='"$"' />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Phone Number</label>
              <input {...register('phone_number')} className="w-full bg-primary border border-white/10 p-3 text-white focus:outline-none focus:border-gold" placeholder='"+1 555-123-4567"' />
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5">
            <button type="submit" className="bg-gold hover:bg-gold-light text-primary px-8 py-3 font-bold uppercase tracking-wider text-sm transition-colors">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
