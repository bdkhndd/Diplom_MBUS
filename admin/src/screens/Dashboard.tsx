import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, Building2, GraduationCap, 
  Handshake, CreditCard, Wallet, Video, MessageSquare, Phone, LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Үндсэн хуудас', href: '/', icon: <LayoutDashboard className="w-6 h-6" /> },
  { name: 'Тэнхим', href: '/tenhim', icon: <Building2 className="w-6 h-6" /> },
  { name: 'Мэргэжил', href: '/mergejil', icon: <GraduationCap className="w-6 h-6" /> },
  { name: 'Хамтарсан хөтөлбөр', href: '/hamtarsan_hut', icon: <Handshake className="w-6 h-6" /> },
  { name: 'Төлбөр', href: '/tulbur', icon: <CreditCard className="w-6 h-6" /> },
  { name: 'Тэтгэлэг', href: '/tetgeleg', icon: <Wallet className="w-6 h-6" /> },
  { name: 'Видео', href: '/video', icon: <Video className="w-6 h-6" /> },
  { name: 'Санал', href: '/feedback', icon: <MessageSquare className="w-6 h-6" /> },
  { name: 'Холбоо барих', href: '/contact', icon: <Phone className="w-6 h-6" /> },
];

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login', { replace: true });
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-indigo-950 text-white shadow-2xl">
      <div className="flex items-center h-20 px-6 border-b border-indigo-900/50 flex-shrink-0">
        <div className="flex items-center gap-3">
         <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center">
  <img 
    src="/logo.png" 
    alt="Logo" 
    className="w-8 h-8 object-contain brightness-0 invert" 
  />
</div>
          <span className="text-xl font-bold tracking-tight italic">MBUS Admin</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar bg-indigo-950">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-indigo-200 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-900 bg-indigo-950/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-semibold text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Системээс гарах</span>
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 w-64 z-40 bg-indigo-950">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 h-screen">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b px-4 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-800">MBUS Admin</span>
          </div>
          <button 
            onClick={() => setMobileNavOpen(true)} 
            className="p-2 bg-slate-100 rounded-lg text-slate-600 active:scale-95 transition-transform"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Sidebar Overlay - ЭНЭ ХЭСЭГ ХАРЛУУЛАХАД НӨЛӨӨЛДӨГ */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setMobileNavOpen(false)} 
            />
            <div className="absolute inset-y-0 left-0 w-72 bg-indigo-950 shadow-2xl">
              <SidebarContent onClose={() => setMobileNavOpen(false)} />
              <button 
                onClick={() => setMobileNavOpen(false)}
                className="absolute top-4 right-[-45px] p-2 text-white bg-indigo-900 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;