import React, { useState, useEffect, type JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, GraduationCap, Handshake, 
  Wallet, CreditCard, Video, MessageSquare, 
  ArrowRight, type LucideProps 
} from 'lucide-react';

// Контекст болон Дэлгэцүүдийг импортлох
import { APIActionContextProvider } from './context/APIActionContext'; 
import Dashboard from './screens/Dashboard'; 
import Login from './screens/login';
import TenhimDataGrid from './screens/TenhimDataGrid';
import TenhimCreateScreen from './screens/TenhimCreateScreen';
import TenhimEditScreen from './screens/TenhimEditScreen';
import MergejilDataGrid from './screens/MergejilDataGrid';
import MergejilCreateScreen from './screens/MergejilCreateScreen'; 
import MergejilEditScreen from './screens/MergejilEditScreen';
import { TetgelegDataGrid } from './screens/TetgelegDataGrid';
import { TetgelegCreateScreen } from './screens/TetgelegCreateScreen';
import { TetgelegEditScreen } from './screens/TetgelegEditScreen';
import TulburDataGrid from './screens/TulburDaraGrid';
import TulburCreateScreen from './screens/TulburCreateScreen';
import TulburEditScreen from './screens/TulburEditScreen';
import { VideoDataGrid } from './screens/videoDataGrid';
import { VideoCreateScreen } from './screens/VideoCreateScreen';
import { VideoEditScreen } from './screens/VideoEditScreen';
import FeedbackDataGrid from './screens/feedbackDataGrid';
import { ContactDataGrid } from './screens/ContactDataGrid';
import { ContactCreateScreen } from './screens/ContactCreateScreen';
import { ContactEditScreen } from './screens/ContactEditScreen';
import { HamtarsanHutEdit } from './screens/HamtarsanHutEditScreen';
import { HamtarsanHutCreate } from './screens/hamtarsanHutCreate';
import { HamtarsanHutDataGrid } from './screens/HamtarsanHutDataGrid';

// --- Хамгаалалттай замын компонент ---
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('adminUser'); 
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- Статистик карт компонент ---
interface StatCardProps {
  icon: React.ReactElement<LucideProps>;
  name: string;
  count: number;
  color: string;
  path: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, name, count, color, path }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(path)}
      className={`bg-gradient-to-br ${color} rounded-2xl shadow-xl p-6 lg:p-8 text-white transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden`}
    >
      <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:scale-125 transition-transform duration-500">
        {React.cloneElement(icon, { size: 100 })}
      </div>
      <div className="relative z-10">
        <div className="bg-white/20 w-fit p-3 rounded-xl mb-4 backdrop-blur-md shadow-inner">
          {React.cloneElement(icon, { size: 28 })}
        </div>
        <h3 className="text-lg lg:text-xl font-bold mb-1 opacity-90">{name}</h3>
        <div className="flex items-end justify-between">
          <p className="text-4xl lg:text-5xl font-black tracking-tight">{count}</p>
          <div className="bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Нүүр хуудас (Статистик харах хэсэг) ---
const Home = () => {
  const [counts, setCounts] = useState({
    tenhim: 0, mergejil: 0, hamtarsan: 0, tetgeleg: 0, tulbur: 0, video: 0, feedback: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get('http://192.168.1.3:4000/api/stats/counts');
        if (res.data && res.data.success) {
          setCounts(res.data.data); 
        } else {
          setCounts(res.data);
        }
      } catch (error) {
        console.error("Дата авахад алдаа гарлаа:", error);
        // Алдаа гарсан үед харуулах туршилтын өгөгдөл
        setCounts({
          tenhim: 8, mergejil: 24, hamtarsan: 12, tetgeleg: 15, tulbur: 3, video: 18, feedback: 47
        });
      }
    };
    fetchCounts();
  }, []);

  const cards = [
    { icon: <Building2 />, name: 'Тэнхим', count: counts.tenhim, path: '/tenhim', color: 'from-orange-400 to-orange-600' },
    { icon: <GraduationCap />, name: 'Мэргэжил', count: counts.mergejil, path: '/mergejil', color: 'from-blue-400 to-blue-600' },
    { icon: <Handshake />, name: 'Хамтарсан хөтөлбөр', count: counts.hamtarsan, path: '/hamtarsan_hut', color: 'from-green-400 to-green-600' },
    { icon: <Wallet />, name: 'Тэтгэлэг', count: counts.tetgeleg, path: '/tetgeleg', color: 'from-purple-400 to-purple-600' },
    { icon: <CreditCard />, name: 'Төлбөр', count: counts.tulbur, path: '/tulbur', color: 'from-pink-400 to-pink-600' },
    { icon: <Video />, name: 'Видео', count: counts.video, path: '/video', color: 'from-red-400 to-red-600' },
    { icon: <MessageSquare />, name: 'Санал', count: counts.feedback, path: '/feedback', color: 'from-indigo-400 to-indigo-600' },
  ];

  return (
    <div className="w-full min-h-screen p-4 lg:p-8 bg-gray-50/50">
      <div className="w-full max-w-7xl mx-auto mb-10 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl shadow-2xl p-8 lg:p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-5xl font-black mb-4 tracking-tight">Системийн Удирдлага</h2>
          <p className="text-indigo-100 text-lg lg:text-xl max-w-2xl opacity-90 leading-relaxed">
            Сургуулийн бүх мэдээлэл болон оюутны санал хүсэлт
          </p>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {cards.map((item, idx) => (
            <StatCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Үндсэн Апп компонент ---
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <APIActionContextProvider>
        <Routes>
          {/* Нэвтрэх (Public) */}
          <Route path="/login" element={<Login />} />

          {/* Хамгаалалттай (Private) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Dashboard дотор харагдах дэд хуудсууд */}
            <Route index element={<Home />} />
            
            <Route path="tenhim" element={<TenhimDataGrid />} />
            <Route path="tenhim/create" element={<TenhimCreateScreen />} />
            <Route path="tenhim/edit/:id" element={<TenhimEditScreen />} />

            <Route path="mergejil" element={<MergejilDataGrid />} />
            <Route path="mergejil/create" element={<MergejilCreateScreen />} />
            <Route path="mergejil/edit/:id" element={<MergejilEditScreen />} />

            <Route path="hamtarsan_hut" element={<HamtarsanHutDataGrid />} />
            <Route path="hamtarsan_hut/edit/:id" element={<HamtarsanHutEdit />} />
            <Route path="hamtarsan_hut/create" element={<HamtarsanHutCreate />} />

            <Route path="tetgeleg" element={<TetgelegDataGrid />} />
            <Route path="tetgeleg/create" element={<TetgelegCreateScreen />} />
            <Route path="tetgeleg/edit/:id" element={<TetgelegEditScreen />} />

            <Route path="tulbur" element={<TulburDataGrid />} />
            <Route path="tulbur/create" element={<TulburCreateScreen />} />
            <Route path="tulbur/edit/:id" element={<TulburEditScreen />} />

            <Route path="contact" element={<ContactDataGrid />} />
            <Route path="contact/create" element={<ContactCreateScreen />} />
            <Route path="contact/edit/:id" element={<ContactEditScreen />} />

            <Route path="video" element={<VideoDataGrid />} />
            <Route path="video/create" element={<VideoCreateScreen />} />
            <Route path="video/edit/:id" element={<VideoEditScreen />} />

            <Route path="feedback" element={<FeedbackDataGrid />} />

            {/* 404 Error */}
            <Route path="*" element={
              <div className="w-full min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-9xl font-bold text-slate-200">404</h1>
                  <p className="text-2xl font-semibold text-slate-400 mt-4">Хуудас олдсонгүй</p>
                </div>
              </div>
            } />
          </Route>
        </Routes>
      </APIActionContextProvider>
    </BrowserRouter>
  );
};

export default App;