import React from 'react';
import { LayoutDashboard, Rocket, Landmark, Briefcase, TrendingUp, Settings, Calendar, Bot, FileSpreadsheet, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, setTheme } = useStore();

  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'ipos', label: 'Halka Arz Merkezi', icon: Rocket },
    { id: 'banks', label: 'Banka Hesapları', icon: Landmark },
    { id: 'portfolio', label: 'Portföyüm', icon: Briefcase },
    { id: 'market', label: 'Piyasa Verileri', icon: TrendingUp },
    { id: 'spreadsheet', label: 'Detaylı Takip', icon: FileSpreadsheet },
    { id: 'calendar', label: 'Halka Arz Takvimi', icon: Calendar },
    { id: 'ai-assistant', label: 'AI Analiz Merkezi', icon: Bot },
  ];

  return (
    <div className="w-64 bg-[#0A0B0D] text-slate-200 h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-black italic tracking-tighter bg-emerald-500 text-black px-3 py-1 rounded inline-block">IPO.PRO</h1>
        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">ArzPlus Dashboard</p>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-slate-900 border border-slate-800 text-emerald-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-emerald-500" : "text-slate-600 group-hover:text-slate-400")} />
              <span className={cn("text-sm font-bold tracking-tight", isActive ? "text-slate-200" : "")}>{item.label}</span>
              {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center justify-around bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <button 
            onClick={() => setTheme('light')}
            className={cn("p-2 rounded-xl transition-all", theme === 'light' ? "bg-emerald-500 text-black" : "text-slate-500 hover:text-slate-300")}
          >
            <Sun size={18} />
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={cn("p-2 rounded-xl transition-all", theme === 'dark' ? "bg-emerald-500 text-black" : "text-slate-500 hover:text-slate-300")}
          >
            <Moon size={18} />
          </button>
          <button 
            onClick={() => setTheme('system')}
            className={cn("p-2 rounded-xl transition-all", theme === 'system' ? "bg-emerald-500 text-black" : "text-slate-500 hover:text-slate-300")}
          >
            <Monitor size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-6 border-t border-slate-800">
        <button className="flex items-center space-x-3 text-slate-500 hover:text-slate-200 px-4 py-2 w-full transition-colors group">
          <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="text-xs font-bold uppercase tracking-widest">Sistem Ayarları</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
