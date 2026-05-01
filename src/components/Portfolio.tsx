import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, TrendingUp, TrendingDown, PieChart, Landmark, ArrowUpRight, ArrowDownRight, History, CircleDollarSign, Plus, Eye, EyeOff, X, BrainCircuit } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { useMarketData } from '../hooks/useMarketData';

import PortfolioSkeleton from './PortfolioSkeleton';
import AddAssetModal from './AddAssetModal';

const Portfolio: React.FC = () => {
  const { portfolio, togglePortfolioStatus, removePortfolioItem } = useStore();
  const { marketData, totalPortfolioValue, unrealizedProfit } = useMarketData();
  const [showHistory, setShowHistory] = useState(false);
  const [isConsolidated, setIsConsolidated] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!marketData.length) return <PortfolioSkeleton />;

  const activeItems = portfolio.filter(p => p.status === 'ACTIVE');
  const soldItems = portfolio.filter(p => p.status === 'SOLD');

  const realizedProfit = soldItems.reduce((acc, item) => {
    const profit = (item.sellPrice! - item.buyPrice) * item.lots;
    return acc + profit;
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Portföy Mühendisliği</h2>
          <p className="text-slate-500 text-sm font-medium">Varlıklarınızın derinlemesine analizi ve konsolide takibi.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg"
          >
            <Plus size={14} /> Yeni Varlık Ekle
          </button>
          <button 
            onClick={() => setIsConsolidated(!isConsolidated)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-all"
          >
            {isConsolidated ? <EyeOff size={14} /> : <Eye size={14} />}
            {isConsolidated ? 'Hesapları Göster' : 'Konsolide Görünüm'}
          </button>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              showHistory ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
            )}
          >
            <History size={14} /> {showHistory ? 'Aktif Portföy' : 'Satış Geçmişi'}
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Aktif Portföy Değeri" value={formatCurrency(totalPortfolioValue)} icon={<Landmark />} color="text-indigo-400" />
        <StatCard label="Gerçekleşen Kâr (Kesin)" value={formatCurrency(realizedProfit)} icon={<CircleDollarSign />} color="text-emerald-400" positive={realizedProfit >= 0} />
        <StatCard label="Anlık Potansiyel" value={formatCurrency(unrealizedProfit)} icon={<TrendingUp />} color="text-amber-400" positive={unrealizedProfit >= 0} />
      </div>

      <AnimatePresence mode="wait">
        {!showHistory ? (
          <motion.div 
            key="active" 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {activeItems.map((item) => (
              <PortfolioGroup 
                key={item.id} 
                item={item} 
                isConsolidated={isConsolidated} 
                marketPrice={marketData.find(s => s.ticker === item.ticker)?.price || item.buyPrice}
                lastPrice={marketData.find(s => s.ticker === item.ticker)?.lastPrice || item.buyPrice}
                onSell={(price: number) => togglePortfolioStatus(item.id, price)}
                onRemove={() => removePortfolioItem(item.id)}
              />
            ))}
            
            {activeItems.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                <Briefcase size={40} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aktif yatırımınız bulunmamaktadır.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="history" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#0F1115] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-slate-800 bg-slate-900/30">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <History size={14} /> Kesinleşmiş İşlemler Arşivi
               </h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[10px] uppercase font-black text-slate-600 tracking-widest border-b border-slate-800/50">
                        <th className="px-8 py-6">Varlık</th>
                        <th className="px-8 py-6">Lot Mik.</th>
                        <th className="px-8 py-6">Alış/Satış</th>
                        <th className="px-8 py-6">Toplam Kâr</th>
                        <th className="px-8 py-6">Getiri (%)</th>
                        <th className="px-8 py-6">İşlem</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                     {soldItems.map((item) => {
                       const profit = (item.sellPrice! - item.buyPrice) * item.lots;
                       const roi = ((item.sellPrice! - item.buyPrice) / item.buyPrice) * 100;
                       return (
                         <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="px-8 py-5">
                               <span className="block font-black text-slate-100 italic">{item.ticker}</span>
                               <span className="text-[9px] text-slate-600 font-bold uppercase">{item.name}</span>
                            </td>
                            <td className="px-8 py-5 font-mono text-xs text-slate-400">{item.lots} Lot</td>
                            <td className="px-8 py-5">
                               <div className="text-[10px] font-bold text-slate-500">A: {formatCurrency(item.buyPrice)}</div>
                               <div className="text-[10px] font-bold text-emerald-400">S: {formatCurrency(item.sellPrice!)}</div>
                            </td>
                            <td className={cn(
                              "px-8 py-5 font-mono font-bold text-sm",
                              profit >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}>{formatCurrency(profit)}</td>
                            <td className="px-8 py-5">
                               <span className={cn(
                                 "text-[10px] font-black px-2 py-1 rounded",
                                 roi >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                               )}>%{roi.toFixed(2)}</span>
                            </td>
                            <td className="px-8 py-5">
                               <button 
                                 onClick={() => togglePortfolioStatus(item.id)}
                                 className="text-[9px] font-bold text-slate-600 hover:text-indigo-400 uppercase tracking-widest border border-slate-800 px-2 py-1 rounded transition-all"
                               >
                                 Geri Al
                               </button>
                            </td>
                         </tr>
                       );
                     })}
                  </tbody>
               </table>
               {soldItems.length === 0 && (
                 <div className="py-20 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">Henüz gerçekleşmiş bir satış işlemi yok.</div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PortfolioGroup = ({ item, isConsolidated, marketPrice, lastPrice, onSell, onRemove }: any) => {
  const currentTotalValue = marketPrice * item.lots;
  const currentTotalCost = item.buyPrice * item.lots;
  const profit = currentTotalValue - currentTotalCost;
  const roi = (profit / currentTotalCost) * 100;

  return (
    <div className="bg-[#0F1115] rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden">
       <div className="p-8 bg-slate-900/30 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black italic text-3xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                {item.ticker[0]}
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <h3 className="text-2xl font-black text-slate-100 italic tracking-tighter">{item.ticker}</h3>
                   <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded border border-emerald-500/20 uppercase">Aktif</span>
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{item.name}</p>
             </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-8">
             <div className="text-right">
                <span className="block text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Maliyet (Ort.)</span>
                <span className="text-lg font-mono font-bold text-slate-400">{formatCurrency(item.buyPrice)}</span>
             </div>
             <div className="text-right">
                <span className="block text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Cari Fiyat</span>
                <span className={cn(
                  "text-lg font-mono font-bold transition-all px-2 py-1 rounded-lg",
                  marketPrice > lastPrice ? "animate-flash-up text-emerald-500" : 
                  marketPrice < lastPrice ? "animate-flash-down text-rose-500" : "text-slate-100"
                )}>
                  {formatCurrency(marketPrice)}
                </span>
             </div>
             <div className="text-right">
                <span className="block text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Anlık K/Z</span>
                <div className={cn(
                  "text-lg font-mono font-bold",
                  profit >= 0 ? "text-emerald-500" : "text-rose-500"
                )}>
                  {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                  <span className="text-[10px] ml-1 opacity-70">({roi.toFixed(1)}%)</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('analyze-stock', { detail: item.ticker }))}
                  className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
                  title="AI Tavan Analizi"
                >
                  <BrainCircuit size={18} />
                </button>
                <button 
                  onClick={() => onSell(marketPrice)}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black rounded-xl transition-all shadow-lg uppercase tracking-widest"
                >
                  Satış Yap
                </button>
                <button 
                  onClick={onRemove}
                  className="p-2 text-slate-700 hover:text-rose-500 transition-colors"
                  title="Tamamen Sil"
                >
                  <X size={20} />
                </button>
             </div>
          </div>
       </div>

       {!isConsolidated && (
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-900/50 text-[9px] uppercase font-black text-slate-500 tracking-widest">
                     <th className="px-8 py-4">Alt Hesap</th>
                     <th className="px-8 py-4">Kurum</th>
                     <th className="px-8 py-4">Lot Sayısı</th>
                     <th className="px-8 py-4">Alt Maliyet</th>
                     <th className="px-8 py-4">Toplam Değer</th>
                     <th className="px-8 py-4">K/Z Durumu</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {item.accounts.map((acc: any, i: number) => {
                    const subProfit = (marketPrice - acc.cost) * acc.lots;
                    return (
                      <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                         <td className="px-8 py-4 font-bold text-slate-300 italic">{acc.name}</td>
                         <td className="px-8 py-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">{acc.bank}</td>
                         <td className="px-8 py-4 font-mono text-slate-400 text-xs">{acc.lots} Lot</td>
                         <td className="px-8 py-4 font-mono text-slate-400 text-xs">{formatCurrency(acc.cost)}</td>
                         <td className="px-8 py-4 font-mono text-slate-200 text-xs">{formatCurrency(marketPrice * acc.lots)}</td>
                         <td className={cn(
                           "px-8 py-4 font-mono font-bold text-[10px]",
                           subProfit >= 0 ? "text-emerald-500" : "text-rose-500"
                         )}>
                           {subProfit >= 0 ? '+' : ''}{formatCurrency(subProfit)}
                         </td>
                      </tr>
                    );
                  })}
               </tbody>
            </table>
         </div>
       )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, positive }: any) => (
  <div className="bg-[#0F1115] border border-slate-800 p-8 rounded-3xl shadow-xl flex items-center gap-6 group hover:border-slate-700 transition-all">
     <div className={cn("w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0", color)}>
        {React.cloneElement(icon, { size: 28 })}
     </div>
     <div>
        <span className="block text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">{label}</span>
        <div className="flex items-baseline gap-2">
           <span className="text-2xl font-black text-slate-100 italic tracking-tighter">{value}</span>
           {positive !== undefined && (
             <span className={cn(
               "text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
               positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
             )}>
                {positive ? <TrendingUp size={10} className="inline mr-1" /> : <TrendingDown size={10} className="inline mr-1" />}
                {positive ? 'KÂR' : 'ZARAR'}
             </span>
           )}
        </div>
     </div>
  </div>
);

export default Portfolio;
