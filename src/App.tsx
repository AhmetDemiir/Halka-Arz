import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IPOCenter from './components/IPOCenter';
import BankAccounts from './components/BankAccounts';
import Portfolio from './components/Portfolio';
import MarketData from './components/MarketData';
import IPOCalendar from './components/IPOCalendar';
import AIAssistant from './components/AIAssistant';
import IPOSpreadsheet from './components/IPOSpreadsheet';
import Login from './components/Login';
import { Bell, User, Search, TrendingUp, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, onAuthStateChanged, signOut, User as FirebaseUser } from './lib/firebase';
import { useStore } from './store/useStore';

export default function App() {
  const { theme, user, setUser } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Theme Handling
  useEffect(() => {
    const root = window.document.documentElement;
    const updateTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.remove('light', 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
    };
    updateTheme();
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ipos':
        return <IPOCenter />;
      case 'banks':
        return <BankAccounts />;
      case 'portfolio':
        return <Portfolio />;
      case 'market':
        return <MarketData />;
      case 'spreadsheet':
        return <IPOSpreadsheet />;
      case 'calendar':
        return <IPOCalendar />;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] font-sans text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-[#0A0B0D] border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Hisse senedi, banka veya halka arz ara..." 
                  className="w-full bg-slate-900/50 border-slate-800 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl py-2 pl-10 pr-4 text-sm transition-all text-slate-300"
                />
             </div>
             <div className="hidden lg:flex items-center gap-4 ml-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">BIST 100</span>
                  <span className="text-sm font-mono text-emerald-400">9,240.50 <small className="text-[10px]">+1.2%</small></span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Toplam Varlık</div>
              <div className="text-xl font-light text-emerald-500">₺1.428.940,00</div>
            </div>
            
            <button className="relative p-2 text-slate-500 hover:text-emerald-400 hover:bg-slate-900 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#0A0B0D]"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-800"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{user?.displayName || 'Kullanıcı'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Premium Üye</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" />
                ) : (
                  <span className="text-xs font-black text-emerald-500">{(user?.displayName || 'U')[0]}</span>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className="ml-2 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                title="Çıkış Yap"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 pb-12 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-auto p-8 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
               &copy; 2026 ArzPlus Portal. Tüm hakları saklıdır. Veriler bilgilendirme amaçlıdır.
            </p>
        </footer>
      </main>
    </div>
  );
}
