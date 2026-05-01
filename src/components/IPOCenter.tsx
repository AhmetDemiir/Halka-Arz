import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Clock, CheckCircle2, ChevronRight, Info, Users, BarChart3, TrendingUp, Landmark, Calculator, AlertCircle, ShieldCheck } from 'lucide-react';
import { MOCK_IPOS, MOCK_BANKS } from '../constants';
import { IPO, IPOStatus, DistributionMethod } from '../types';
import { cn, formatCurrency } from '../lib/utils';

const IPOCenter: React.FC = () => {
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Halka Arz Merkezi</h2>
          <p className="text-slate-500 text-sm font-medium">Aktif, beklenen ve geçmiş halka arzların detaylı analizi.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5 border border-emerald-500/20">
            <CheckCircle2 size={12} /> 1 Seans Aktif
          </span>
          <span className="px-3 py-1.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5 border border-slate-700">
            <Clock size={12} /> 1 Bekleyen
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* IPO List */}
        <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
          {MOCK_IPOS.map((ipo) => (
            <motion.div
              layoutId={ipo.id}
              key={ipo.id}
              onClick={() => setSelectedIPO(ipo)}
              className={cn(
                "p-5 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden",
                selectedIPO?.id === ipo.id
                  ? "border-emerald-500 bg-[#0F1115] shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 flex items-center justify-center font-black italic">
                    {ipo.ticker[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{ipo.name}</h4>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1 block">
                      {ipo.ticker}
                    </span>
                  </div>
                </div>
                <StatusBadge status={ipo.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest opacity-60">Sabit Fiyat</span>
                  <p className="font-mono font-bold text-emerald-400">{formatCurrency(ipo.price)}</p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest opacity-60">Dağıtım</span>
                  <p className="font-bold text-slate-300 text-[11px] truncate uppercase">{ipo.distributionMethod}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                   <Clock size={12} className="text-slate-600" />
                   Talep Toplama: {ipo.startDate}
                </span>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedIPO ? (
              <motion.div
                key={selectedIPO.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-[#0F1115] rounded-3xl border border-slate-800 shadow-2xl p-8 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-black text-2xl flex items-center justify-center font-black italic shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      {selectedIPO.ticker[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-100 italic uppercase tracking-tighter">{selectedIPO.name}</h3>
                      <div className="flex gap-4 items-center mt-2">
                        <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded font-bold tracking-widest">
                          {selectedIPO.ticker}.HE
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pencere Sonu: {selectedIPO.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 px-8 py-3 bg-slate-900 border border-slate-800 text-emerald-400 rounded-xl font-bold hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                      <BarChart3 size={14} /> AI Tavan Tahmini
                    </button>
                    <button className="flex-1 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(5,150,105,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                      KATILIM SAĞLA
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  <InfoCard label="Birim Fiyat" value={formatCurrency(selectedIPO.price)} icon={<TrendingUp size={14} />} color="indigo" />
                  <InfoCard label="Tahmini Lot" value={`~${selectedIPO.expectedLot} Lot`} icon={<Calculator size={14} />} color="emerald" />
                  <InfoCard label="Arz Büyüklüğü" value="₺1.2B" icon={<BarChart3 size={14} />} color="amber" />
                </div>

                <div className="space-y-10">
                   <section>
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info size={14} className="text-emerald-500" /> Stratejik Analiz
                     </h4>
                     <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 text-slate-400 text-sm leading-relaxed font-medium">
                        {selectedIPO.summary} Bu operasyon, grubun likidite yapısını optimize etmek ve yeni nesil enerji teknolojilerine yönelik Ar-Ge faaliyetlerini ölçeklendirmek amacıyla kurgulanmıştır. Katılım endeksine uygunluğu ve %30'luk iskonto oranı ile orta-uzun vade için dengeli bir pozisyon sunmaktadır.
                     </div>
                   </section>

                   <section>
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <BarChart3 size={14} className="text-emerald-500" /> Lot Dağılım Senaryoları
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                           <div className="space-y-5">
                              {[
                                { users: '2.5M Katılım', lots: '42 Lot', amount: '₺5.670', trend: 'high' },
                                { users: '3.2M Katılım', lots: '33 Lot', amount: '₺4.455', trend: 'med' },
                                { users: '4.5M Katılım', lots: '23 Lot', amount: '₺3.105', trend: 'low' },
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                                  <span className="text-slate-500 font-bold uppercase tracking-tight">{item.users}</span>
                                  <div className="flex items-center gap-6">
                                     <span className="font-mono text-slate-200 font-bold">{item.lots}</span>
                                     <span className="text-emerald-400 font-mono font-bold w-20 text-right">{item.amount}</span>
                                  </div>
                                </div>
                              ))}
                           </div>
                           <div className="mt-8 pt-6 border-t border-slate-800 relative">
                             <div className="absolute -top-3 left-4 px-2 bg-[#0F1115] text-[10px] font-black text-emerald-500 italic uppercase">Optimal Giriş</div>
                             <div className="flex items-center justify-between font-bold text-slate-100">
                                <span className="text-xs uppercase tracking-widest opacity-60">Hedef Stake</span>
                                <span className="text-xl font-mono text-glow text-emerald-400">₺8.100 <small className="text-[10px] opacity-60">/ 60 Lot</small></span>
                             </div>
                           </div>
                        </div>

                        <div className="bg-emerald-950/10 rounded-2xl border border-emerald-900/30 p-6 flex flex-col items-center justify-center text-center">
                           <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                              <ShieldCheck size={32} />
                           </div>
                           <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">Güvenli Katılım Kontrolü</h5>
                           <p className="text-[11px] text-slate-500 font-bold max-w-[180px] leading-relaxed mb-6">
                              Tüm bankalarınızdaki toplam likidite, bu arz için belirlenen hedef stake tutarını %180 oranında karşılamaktadır.
                           </p>
                           <button className="px-6 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-xs font-bold text-emerald-400 transition-all uppercase tracking-tighter">
                              Otomatik Tahsis Ayarla
                           </button>
                        </div>
                      </div>
                   </section>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/10 border-2 border-dashed border-slate-800 rounded-3xl min-h-[500px]">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700 mb-6 group hover:border-emerald-500/30 transition-all cursor-default">
                   <Rocket size={40} className="group-hover:text-emerald-500/50 transition-all" />
                </div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Derinlik Analiz Platformu</h3>
                <p className="text-[11px] text-slate-600 max-w-xs mx-auto mt-4 font-bold">Lütfen aktif veya beklenen bir varlık seçimi yaparak likidite projeksiyonlarını inceleyin.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: IPOStatus }) => {
  switch (status) {
    case IPOStatus.ACTIVE:
      return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded border border-emerald-500/20 uppercase flex items-center gap-1 leading-none"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Seans</span>;
    case IPOStatus.UPCOMING:
      return <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[9px] font-black rounded border border-slate-700 uppercase leading-none">Beklemede</span>;
    case IPOStatus.COMPLETED:
      return <span className="px-2 py-0.5 bg-slate-900 text-slate-600 text-[9px] font-black rounded border border-slate-800 uppercase leading-none">Kapalı</span>;
    default:
      return null;
  }
};

const InfoCard = ({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: 'indigo' | 'emerald' | 'amber' }) => {
  const styles = {
    indigo: "bg-slate-900 border-slate-800 text-slate-300 icon:bg-indigo-500/10 icon:text-indigo-400",
    emerald: "bg-slate-900 border-slate-800 text-slate-300 icon:bg-emerald-500/10 icon:text-emerald-400",
    amber: "bg-slate-900 border-slate-800 text-slate-300 icon:bg-amber-500/10 icon:text-amber-400",
  };

  return (
    <div className={cn("p-4 rounded-xl border flex flex-col gap-3 group hover:border-emerald-500/30 transition-colors", styles[color])}>
       <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg transition-transform group-hover:scale-110", color === 'indigo' ? "bg-slate-800 text-indigo-400" : color === 'emerald' ? "bg-slate-800 text-emerald-400" : "bg-slate-800 text-amber-400")}>
            {icon}
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">{label}</span>
       </div>
       <span className="text-lg font-bold font-mono text-slate-100">{value}</span>
    </div>
  );
};

export default IPOCenter;
