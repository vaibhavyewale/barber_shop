import React, { useEffect, useState } from 'react';
import { Trash2, Mail, Phone, Calendar } from 'lucide-react';

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

export default function Contacts() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMessages();
      } else {
        alert('Failed to delete message.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Contact Messages</h2>
      </div>

      <div className="bg-secondary rounded-sm border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary/50 text-xs uppercase tracking-wider text-text-gray">
              <tr>
                <th className="px-6 py-4 font-bold">Details</th>
                <th className="px-6 py-4 font-bold">Message</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-gray">
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-primary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1">{msg.name}</div>
                      <div className="text-xs text-text-gray flex items-center gap-1 mb-1">
                        <Mail className="w-3 h-3" /> {msg.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1">{msg.subject || 'No Subject'}</div>
                      <div className="text-sm text-text-gray max-w-md truncate">{msg.message}</div>
                    </td>
                    <td className="px-6 py-4 text-text-gray text-sm">
                      {new Date(msg.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(msg.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
