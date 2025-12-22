import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, Building2, GraduationCap, 
  Handshake, CreditCard, Wallet, Video, MessageSquare, Phone
} from 'lucide-react';

const navigation = [
  { name: 'Үндсэн хуудас', href: '/', icon: <LayoutDashboard className="w-7 h-7" /> },
  { name: 'Тэнхим', href: '/tenhim', icon: <Building2 className="w-7 h-7" /> },
  { name: 'Мэргэжил', href: '/mergejil', icon: <GraduationCap className="w-7 h-7" /> },
  { name: 'Хамтарсан', href: '/hamtarsan_hut', icon: <Handshake className="w-7 h-7" /> },
  { name: 'Төлбөр', href: '/tulbur', icon: <CreditCard className="w-7 h-7" /> },
  { name: 'Тэтгэлэг', href: '/tetgeleg', icon: <Wallet className="w-7 h-7" /> },
  { name: 'Видео', href: '/video', icon: <Video className="w-7 h-7" /> },
  { name: 'Санал', href: '/feedback', icon: <MessageSquare className="w-7 h-7" /> },
  { name: 'Холбоо барих', href: '/contact', icon: <Phone className="w-7 h-7" /> },
];

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => (
  <div className="flex flex-col h-full bg-indigo-950 text-white">
    <div className="flex items-center h-16 px-6 border-b border-indigo-900">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg text-white font-bold">M</div>
        <span className="text-lg font-bold tracking-tight text-white">MBUS Admin</span>
      </div>
    </div>

    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      {navigation.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              isActive 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-indigo-200 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>

    <div className="p-5 border-t border-indigo-900 text-[10px] text-indigo-400">
      <p>© 2025 MBUS App</p>
      <p className="uppercase tracking-wider">Admin Dashboard v1.0.0</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 w-64 shadow-xl z-40">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
             <span className="text-base font-bold text-slate-800">MBUS Admin</span>
          </div>
          <button 
            onClick={() => setMobileNavOpen(true)} 
            className="p-2 bg-slate-100 rounded-lg text-slate-600 active:scale-95 transition-transform"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Overlay Sidebar */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden transition-opacity duration-300">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all" 
              onClick={() => setMobileNavOpen(false)} 
            />
            
            {/* Sidebar Slide-in */}
            <div className="absolute inset-y-0 left-0 w-64 shadow-2xl transition-transform duration-300">
              <SidebarContent onClose={() => setMobileNavOpen(false)} />
              <button 
                onClick={() => setMobileNavOpen(false)}
                className="absolute top-4 right-[-50px] p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;