import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Scissors, UserCheck, ClipboardList, Image as ImageIcon, ShoppingBag, FileText, MessageSquare, Mail } from 'lucide-react';

const ADMIN_LINKS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
  { name: 'Barbers', path: '/admin/barbers', icon: UserCheck },
  { name: 'Services', path: '/admin/services', icon: ClipboardList },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { name: 'Products', path: '/admin/products', icon: ShoppingBag },
  { name: 'Blog', path: '/admin/blog', icon: FileText },
  { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
  { name: 'Contacts', path: '/admin/contacts', icon: Mail },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary border-r border-white/5 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 group">
            <Scissors className="w-6 h-6 text-gold" />
            <span className="text-xl font-heading font-bold tracking-wider text-white">
              LUXE<span className="text-gold">CUT</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {ADMIN_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
                  isActive 
                    ? 'bg-gold/10 text-gold border-r-2 border-gold' 
                    : 'text-text-gray hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-text-gray hover:bg-white/5 hover:text-white rounded-sm transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-secondary border-b border-white/5 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold font-heading">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gold text-primary flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-primary">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
