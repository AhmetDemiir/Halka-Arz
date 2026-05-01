import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Activity, Globe, Zap, Calendar, ArrowUpRight, ArrowDownRight, Search, AlertTriangle } from 'lucide-react';
import { MOCK_STOCKS } from '../constants';
import { formatCurrency, cn } from '../lib/utils';

const MarketData: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedStock, setSearchedStock] = useState<any>(null);
  const [liveStocks, setLiveStocks] = useState(MOCK_STOCKS);

  // Simulate live data fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStocks(current => 
        current.map(stock => ({
          ...stock,
          price: stock.price * (1 + (Math.random() * 0.002 - 0.001)), // +/- 0.1% change
        }))
      );
      
      if (searchedStock) {
        setSearchedStock((prev: any) => ({
          ...prev,
          price: prev.price * (1 + (Math.random() * 0.002 - 0.001)),
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [searchedStock]);

  const handleSearch = () => {
    if (!searchQuery) return;
    
    // Simulate a search result - in a real app this would call an API
    const ticker = searchQuery.toUpperCase();
    const foundInMock = MOCK_STOCKS.find(s => s.ticker === ticker);
    
    if (foundInMock) {
      setSearchedStock(foundInMock);
    } else {
      // Mock a random stock for demonstration
      setSearchedStock({
        ticker: ticker,
        price: Math.random() * 500 + 10,
        change: (Math.random() * 10 - 5).toFixed(2),
        volume: Math.floor(Math.random() * 10000000)
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Piyasa Verileri</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-500 text-sm font-medium">Borsa İstanbul ve küresel endekslerin anlık takibi.</p>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] font-black text-amber-500 uppercase tracking-widest">
              <AlertTriangle size={10} /> Test Verisi (15dk Gecikmeli)
            </span>
          </div>
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
           <button className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">BIST</button>
           <button className="px-4 py-1.5 text-slate-500 hover:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Global</button>
           <button className="px-4 py-1.5 text-slate-500 hover:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Kripto</button>
        </div>
      </header>

      <AnimatePresence>
        {searchedStock && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-[#0A0B0D]/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl bg-[#0F1115] border border-slate-800 rounded-[2.5rem] shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide relative">
              <button 
                onClick={() => setSearchedStock(null)}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <Globe size={24} className="rotate-45" /> 
              </button>

              <div className="p-8 md:p-12">
                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tighter">{searchedStock.ticker}</h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">Metropol Kurumsal Hizmetler A.Ş.</p>
                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-5xl font-mono font-bold text-slate-50">₺{searchedStock.price.toFixed(2).replace('.', ',')}</span>
                    <span className={cn(
                      "text-lg font-bold",
                      searchedStock.change >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      %{Math.abs(searchedStock.change).toString().replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Main Chart Area */}
                <div className="h-64 md:h-80 w-full mb-8 relative">
                   {/* Simplified visual chart line */}
                   <svg className="w-full h-full" viewBox="0 0 1000 200">
                      <path 
                        d="M0,150 Q50,130 100,160 T200,120 T300,140 T400,80 T500,100 T600,130 T700,90 T800,110 T900,140 L1000,130" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <line x1="0" y1="130" x2="1000" y2="130" stroke="#1e293b" strokeDasharray="4" />
                   </svg>
                   <div className="absolute top-1/2 left-4 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold text-slate-300">
                      ₺161,90
                   </div>
                </div>

                {/* Time Filters */}
                <div className="flex justify-center gap-1 md:gap-4 mb-12">
                  {['1G', '1H', '1A', '3A', '1Y', '5Y'].map(t => (
                    <button key={t} className="px-4 py-2 text-xs font-black text-slate-500 hover:text-white transition-colors">{t}</button>
                  ))}
                  <div className="w-px h-6 bg-slate-800 mx-2" />
                  <button className="p-2 text-rose-500"><TrendingDown size={18} /></button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
                   <div className="space-y-6">
                      <StatRow label="Açılış" value="₺162,00" />
                      <StatRow label="En Yüksek" value="₺165,90" />
                      <StatRow label="Taban" value="₺146,30" />
                      <StatRow label="52 Hafta En Yüksek" value="₺208,80" />
                   </div>
                   <div className="space-y-6">
                      <StatRow label="Önceki Kapanış" value="₺161,90" />
                      <StatRow label="En Düşük" value="₺160,80" />
                      <StatRow label="Tavan" value="₺178,70" />
                      <StatRow label="52 Hafta En Düşük" value="₺88,00" />
                   </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 sticky bottom-0 bg-[#0F1115] pt-4 pb-8 border-t border-slate-800/50">
                   <button className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl transition-all shadow-xl uppercase tracking-widest text-sm">Sat</button>
                   <button className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl transition-all shadow-xl uppercase tracking-widest text-sm">Al</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Symbol Search & Instant View */}
      <div className="bg-[#0F1115] rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             <Search size={14} className="text-emerald-500" /> Akıllı Sembol Sorgulama
          </h3>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Hisse kodu girin (Örn: THYAO, ASELS...)" 
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-slate-200 font-bold focus:outline-none focus:border-emerald-500/50 transition-all uppercase placeholder:normal-case placeholder:font-medium placeholder:text-slate-600"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] uppercase tracking-widest text-xs"
            >
              Sorgula
            </button>
          </div>

          <AnimatePresence mode="wait">
            {searchedStock ? (
              <motion.div 
                key={searchedStock.ticker}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800"
              >
                <div className="flex items-center gap-4 border-r border-slate-800 pr-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-black italic text-xl">
                    {searchedStock.ticker[0]}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-100 italic tracking-tighter">{searchedStock.ticker}</h4>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Anlık Veri</span>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Cari Fiyat</span>
                  <span className="text-2xl font-mono font-bold text-slate-100">{formatCurrency(searchedStock.price)}</span>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Günlük Değişim</span>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 text-lg font-bold",
                    searchedStock.change >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {searchedStock.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    %{Math.abs(searchedStock.change)}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">İşlem Hacmi</span>
                  <span className="text-lg font-mono font-bold text-slate-400">{(searchedStock.volume / 1000000).toFixed(2)}M ₺</span>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl">
                <Globe size={40} className="text-slate-800 mx-auto mb-4" />
                <p className="text-slate-600 font-bold text-xs uppercase tracking-widest">Sorgulama yapmak için bir sembol kodu girin</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IndexCard name="XU100" value="10,245.50" change="+1.24%" positive={true} />
        <IndexCard name="XU030" value="11,450.20" change="+0.85%" positive={true} />
        <IndexCard name="XBANK" value="8,920.40" change="-0.45%" positive={false} />
        <IndexCard name="XSINY" value="14,120.10" change="+2.10%" positive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Leaders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0F1115] rounded-3xl border border-slate-800 shadow-2xl p-8">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Activity size={14} className="text-emerald-500" /> Aktif İşlemler
                </h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="Sembol Ara..." 
                    className="bg-slate-900/50 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
             </div>
             
             <div className="space-y-4">
                {liveStocks.map((stock, i) => (
                  <motion.div 
                    key={stock.ticker}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-slate-800 group hover:border-emerald-500/30 transition-all cursor-pointer"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center font-black italic group-hover:bg-slate-800 transition-all">
                           {stock.ticker[0]}
                        </div>
                        <div>
                           <span className="block font-black text-slate-200 uppercase tracking-tight">{stock.ticker}</span>
                           <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-none mt-1 block">BIST Yıldız Pazar</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-12">
                        <div className="text-right hidden md:block">
                           <span className="text-[9px] text-slate-600 font-black uppercase block mb-1">Hacim</span>
                           <span className="text-xs font-mono font-bold text-slate-400">{(stock.volume / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="text-right min-w-[100px]">
                           <span className="block font-mono font-bold text-slate-100">{formatCurrency(stock.price)}</span>
                           <div className={cn(
                             "text-[9px] font-black mt-1 inline-flex items-center gap-1",
                             stock.change > 0 ? "text-emerald-500" : "text-rose-500"
                           )}>
                              {stock.change > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                              %{Math.abs(stock.change)}
                           </div>
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
             
             <button className="w-full mt-8 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all">
                Tümünü Yükle
             </button>
          </div>
        </div>

        {/* Economic Calendar & Quick Data */}
        <div className="space-y-8">
           <div className="bg-[#0F1115] rounded-3xl border border-slate-800 p-8 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                 <Calendar size={14} className="text-emerald-500" /> Ekonomi Takvimi
              </h3>
              <div className="space-y-6">
                 <CalendarItem date="14 Haz" title="TCMB Faiz Kararı" impact="high" />
                 <CalendarItem date="15 Haz" title="ABD Enflasyon (TÜFE)" impact="high" />
                 <CalendarItem date="17 Haz" title="BIST Sektörel Analiz" impact="med" />
                 <CalendarItem date="20 Haz" title="IPO: KOTON Talep Toplama" impact="high" />
              </div>
           </div>

           <div className="bg-emerald-950/10 rounded-3xl border border-emerald-900/30 p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] pointer-events-none" />
              <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
                 <Zap size={14} /> Hızlı Sinyaller
              </h3>
              <div className="space-y-4 relative z-10">
                 <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[11px] text-emerald-400 font-bold mb-2 uppercase tracking-tight">XU100 Destek Seviyesi</p>
                    <span className="text-2xl font-mono font-bold text-slate-100">10,180.00</span>
                    <div className="w-full bg-emerald-950 h-1 rounded-full mt-3 overflow-hidden">
                       <div className="w-4/5 h-full bg-emerald-500" />
                    </div>
                 </div>
                 <p className="text-[10px] text-slate-600 font-bold italic leading-relaxed">
                   * Algoritma şu an "Hafif Boğa" piyasası sinyali veriyor. Halka arz potansiyelleri pozitif yönde.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-mono font-bold text-slate-200">{value}</span>
  </div>
);

const IndexCard = ({ name, value, change, positive }: { name: string, value: string, change: string, positive: boolean }) => (
  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl group hover:border-emerald-500/30 transition-all cursor-default">
     <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{name}</span>
        <div className={cn(
          "w-2 h-2 rounded-full",
          positive ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
        )} />
     </div>
     <h4 className="text-xl font-mono font-bold text-slate-100 tracking-tighter">{value}</h4>
     <div className="flex items-center gap-1.5 mt-1">
        {positive ? <ArrowUpRight size={12} className="text-emerald-500" /> : <ArrowDownRight size={12} className="text-rose-500" />}
        <span className={cn(
          "text-[10px] font-black uppercase tracking-tight",
          positive ? "text-emerald-500" : "text-rose-500"
        )}>{change}</span>
     </div>
  </div>
);

const CalendarItem = ({ date, title, impact }: { date: string, title: string, impact: 'high' | 'med' | 'low' }) => (
  <div className="flex items-start gap-4">
     <div className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 min-w-[50px] text-center">
        <span className="text-[10px] font-black text-slate-200 block leading-tight">{date.split(' ')[0]}</span>
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{date.split(' ')[1]}</span>
     </div>
     <div className="flex-1">
        <h5 className="text-[11px] font-bold text-slate-300 leading-tight mb-1">{title}</h5>
        <div className="flex items-center gap-2">
           <span className={cn(
             "w-1.5 h-1.5 rounded-full",
             impact === 'high' ? "bg-rose-500" : impact === 'med' ? "bg-amber-500" : "bg-slate-500"
           )} />
           <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">{impact} IMPACT</span>
        </div>
     </div>
  </div>
);

export default MarketData;
