import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

interface Stats {
  revenue: string;
  appointments: number;
  customers: number;
  activeBarbers: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div>Loading...</div>;

  const cards = [
    { title: 'Total Revenue', value: stats?.revenue || '$0', icon: DollarSign, trend: '+12.5%' },
    { title: 'Appointments', value: stats?.appointments || 0, icon: Calendar, trend: '+5.2%' },
    { title: 'Customers', value: stats?.customers || 0, icon: Users, trend: '+2.1%' },
    { title: 'Active Barbers', value: stats?.activeBarbers || 0, icon: TrendingUp, trend: '0%' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading mb-6">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-secondary p-6 rounded-sm border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  {card.trend}
                </span>
              </div>
              <p className="text-text-gray text-sm uppercase tracking-wider font-bold mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold">{card.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-secondary border border-white/5 p-6 rounded-sm">
        <h3 className="text-xl font-bold font-heading mb-4">Recent Activity</h3>
        <p className="text-text-gray">No recent activity to display.</p>
      </div>
    </div>
  );
}
