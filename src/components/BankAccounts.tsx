import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, Plus, ArrowRight, CreditCard, PieChart, ShieldCheck, X, Building2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';

const BankAccounts: React.FC = () => {
  const { userAccounts, addAccount, removeAccount } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newAcc, setNewAcc] = useState({ name: '', bank: 'Ziraat' });

  const handleAdd = () => {
    if (newAcc.name) {
      addAccount({
        id: Math.random().toString(36).substr(2, 9),
        name: newAcc.name,
        bank: newAcc.bank
      });
      setIsAdding(false);
      setNewAcc({ name: '', bank: 'Ziraat' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Hesap Yönetimi</h2>
          <p className="text-slate-500 text-sm font-medium">Banka ve aracı kurum hesaplarınızın konsolide listesi.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center gap-2 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(5,150,105,0.3)]"
        >
          <Plus size={18} /> Yeni Hesap Ekle
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {userAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0F1115] rounded-2xl border border-slate-800 p-6 shadow-2xl hover:border-emerald-500/30 transition-all flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl pointer-events-none" />
              
              <button 
                onClick={() => removeAccount(account.id)}
                className="absolute top-4 right-4 p-1.5 text-slate-700 hover:text-rose-500 transition-colors z-20"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-500 flex items-center justify-center font-black italic shadow-inner">
                  <Landmark size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 uppercase tracking-tighter">{account.bank}</h4>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1 block">{account.name}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between relative z-10">
                <span className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] block">Sistem Entegrasyonu</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Aktif</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0F1115] rounded-2xl border-2 border-emerald-500/30 p-6 flex flex-col gap-4"
          >
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase">Hesap Adı</label>
              <input 
                autoFocus
                value={newAcc.name}
                onChange={(e) => setNewAcc({...newAcc, name: e.target.value})}
                placeholder="Örn: Maaş Hesabı"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase">Banka / Kurum</label>
              <select 
                value={newAcc.bank}
                onChange={(e) => setNewAcc({...newAcc, bank: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option>Ziraat</option>
                <option>Garanti</option>
                <option>İş Bankası</option>
                <option>Yapı Kredi</option>
                <option>Midas</option>
              </select>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={handleAdd} className="flex-1 bg-emerald-600 py-2 rounded-lg text-xs font-black uppercase text-white hover:bg-emerald-500 transition-all">Kaydet</button>
              <button onClick={() => setIsAdding(false)} className="px-3 bg-slate-800 py-2 rounded-lg text-xs font-black uppercase text-slate-400">İptal</button>
            </div>
          </motion.div>
        )}

        <div 
          onClick={() => setIsAdding(true)}
          className="bg-slate-900/20 rounded-2xl border-2 border-dashed border-slate-800 p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-emerald-500/30 hover:bg-slate-900/40 transition-all min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-all shadow-xl mb-4">
             <Plus size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Yeni Birim Ekle</span>
        </div>
      </div>

      <div className="bg-[#0F1115] border border-slate-800 rounded-3xl p-10 text-slate-100 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6">
               <ShieldCheck size={14} /> 256-Bit SSL Secured Entegrasyon
            </div>
            <h3 className="text-3xl font-black italic tracking-tighter mb-6 leading-tight">Otomatik Senkronizasyon ile <br />Gerçek Zamanlı Takip</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed max-w-md">
              Bankalarınızdaki bakiyeleri manuel girmek yerine, API entegrasyonu veya güvenli SMS okuyucu modülümüz ile varlıklarınızı anlık olarak güncelleyebilirsiniz.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(5,150,105,0.2)] uppercase tracking-widest text-xs">
                HEMEN AKTİVE ET
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl group hover:border-emerald-500/30 transition-colors">
                <span className="text-emerald-400 font-mono font-bold block mb-2 text-3xl tracking-tighter transition-transform group-hover:scale-105">0.1s</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-relaxed">Update hızı ile piyasa verilerini milisaniyelik takip edin.</p>
             </div>
             <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl group hover:border-emerald-500/30 transition-colors">
                <span className="text-emerald-400 font-mono font-bold block mb-2 text-3xl tracking-tighter transition-transform group-hover:scale-105">+15</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-relaxed">Desteklenen aktif Türk bankası ve aracı kurum altyapısı.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccounts;
