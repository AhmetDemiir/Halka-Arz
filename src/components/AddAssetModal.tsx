import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Building2, Wallet, CircleDollarSign } from 'lucide-react';
import { useStore } from '../store/useStore';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose }) => {
  const { addPortfolioItem, userAccounts, marketData } = useStore();
  const [formData, setFormData] = useState({
    ticker: '',
    lots: '',
    buyPrice: '',
    selectedAccount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stock = marketData.find(s => s.ticker === formData.ticker.toUpperCase());
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      ticker: formData.ticker.toUpperCase(),
      name: stock?.name || formData.ticker.toUpperCase(),
      status: 'ACTIVE' as const,
      buyPrice: Number(formData.buyPrice),
      lots: Number(formData.lots),
      accounts: [
        { 
          name: formData.selectedAccount || 'Asıl Hesap', 
          bank: userAccounts.find(a => a.name === formData.selectedAccount)?.bank || 'Bilinmiyor',
          lots: Number(formData.lots),
          cost: Number(formData.buyPrice)
        }
      ]
    };

    addPortfolioItem(newItem);
    onClose();
    setFormData({ ticker: '', lots: '', buyPrice: '', selectedAccount: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0F1115] border border-slate-800 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] pointer-events-none" />
            
            <header className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-100 italic tracking-tighter">Yeni Varlık Ekle</h3>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Hisse Sembolü</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    required
                    value={formData.ticker}
                    onChange={(e) => setFormData({...formData, ticker: e.target.value.toUpperCase()})}
                    placeholder="Örn: THYAO" 
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-slate-200 font-bold focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Lot Sayısı</label>
                  <div className="relative">
                    <Wallet size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input 
                      required
                      type="number"
                      value={formData.lots}
                      onChange={(e) => setFormData({...formData, lots: e.target.value})}
                      placeholder="0" 
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-slate-200 font-mono font-bold focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Maliyet (₺)</label>
                  <div className="relative">
                    <CircleDollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input 
                      required
                      type="number"
                      step="0.01"
                      value={formData.buyPrice}
                      onChange={(e) => setFormData({...formData, buyPrice: e.target.value})}
                      placeholder="0.00" 
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-slate-200 font-mono font-bold focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">İlgili Hesap</label>
                <select 
                  value={formData.selectedAccount}
                  onChange={(e) => setFormData({...formData, selectedAccount: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 font-bold focus:outline-none focus:border-emerald-500/50 appearance-none"
                >
                  <option value="">Hesap Seçiniz</option>
                  {userAccounts.map(acc => (
                    <option key={acc.id} value={acc.name}>{acc.name} ({acc.bank})</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] uppercase tracking-widest text-sm flex items-center justify-center gap-3"
              >
                <Plus size={20} /> Portföye Ekle
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddAssetModal;
