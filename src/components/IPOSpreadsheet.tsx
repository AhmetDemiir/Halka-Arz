import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileSpreadsheet, Download, Filter, ChevronDown, User, Landmark, Building2, TrendingUp, CircleDollarSign } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

const MOCK_PARTICIPATION_DATA = [
  { symbol: 'ARYFE', status: 'Satıldı', buyPrice: 19.50, sellPrice: 34.37, totalLots: 288, totalCost: 5616.00, totalValue: 9898.56, netProfit: 4282.56 },
  { symbol: 'MEYSU', status: 'Satıldı', buyPrice: 7.50, sellPrice: 10.98, totalLots: 645, totalCost: 4837.50, totalValue: 7082.10, netProfit: 2244.60 },
  { symbol: 'FRMPL', status: 'Satıldı', buyPrice: 30.24, sellPrice: 53.20, totalLots: 205, totalCost: 6199.20, totalValue: 10905.59, netProfit: 4706.39 },
  { symbol: 'UCAYM', status: 'Satıldı', buyPrice: 18.00, sellPrice: 34.01, totalLots: 270, totalCost: 4860.00, totalValue: 9183.24, netProfit: 4323.24 },
  { symbol: 'NETCD', status: 'Satıldı', buyPrice: 46.00, sellPrice: 103.30, totalLots: 200, totalCost: 9200.00, totalValue: 20660.00, netProfit: 11460.00 },
  { symbol: 'AKHAN', status: 'Satıldı', buyPrice: 21.50, sellPrice: 30.30, totalLots: 280, totalCost: 6020.00, totalValue: 8484.00, netProfit: 2464.00 },
  { symbol: 'BESTE', status: 'Satıldı', buyPrice: 14.70, sellPrice: 25.79, totalLots: 568, totalCost: 8349.60, totalValue: 14648.72, netProfit: 6299.12 },
  { symbol: 'ATATR', status: 'Satıldı', buyPrice: 11.20, sellPrice: 17.21, totalLots: 896, totalCost: 10035.20, totalValue: 15420.16, netProfit: 5384.96 },
  { symbol: 'EMPAE', status: 'Satıldı', buyPrice: 22.00, sellPrice: 38.96, totalLots: 140, totalCost: 3080.00, totalValue: 5454.40, netProfit: 2374.40 },
  { symbol: 'SVGYO', status: 'Satıldı', buyPrice: 3.64, sellPrice: 5.32, totalLots: 696, totalCost: 2533.44, totalValue: 3702.72, netProfit: 1169.28 },
  { symbol: 'LXGYO', status: 'Satıldı', buyPrice: 12.05, sellPrice: 18.75, totalLots: 392, totalCost: 4723.60, totalValue: 7350.00, netProfit: 2626.40 },
  { symbol: 'GENKM', status: 'Satıldı', buyPrice: 11.00, sellPrice: 14.81, totalLots: 1424, totalCost: 15664.00, totalValue: 21089.44, netProfit: 5425.44 },
  { symbol: 'MCARD', status: 'Satıldı', buyPrice: 80.00, sellPrice: 127.08, totalLots: 70, totalCost: 5600.00, totalValue: 8895.60, netProfit: 3295.60 },
  { symbol: 'AAGYO', status: 'Portföyde', buyPrice: 21.10, sellPrice: 19.16, totalLots: 1015, totalCost: 21416.50, totalValue: 0, netProfit: 0 },
];

const FAMILY_BREAKDOWN = [
  { name: 'Ahmet', bank: 'Ziraat', lots: 145, cost: 3059.50 },
  { name: 'Mehmet Can', bank: 'İş Bankası', lots: 145, cost: 3059.50 },
  { name: 'Burak', bank: 'Ziraat', lots: 145, cost: 3059.50 },
  { name: 'Beyza', bank: 'İş Bankası', lots: 145, cost: 3059.50 },
  { name: 'Vahab', bank: 'BtcTürk', lots: 145, cost: 3059.50 },
  { name: 'Muhammed', bank: 'Garanti', lots: 145, cost: 3059.50 },
  { name: 'Tunahan', bank: 'Garanti', lots: 145, cost: 3059.50 },
];

const IPOSpreadsheet: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAGYO');

  const totalNetProfit = MOCK_PARTICIPATION_DATA.reduce((acc, curr) => acc + curr.netProfit, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Detaylı Katılım Analizi</h2>
          <p className="text-slate-500 text-sm font-medium">Bireysel ve aile bazlı halka arz takip çizelgesi.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-all">
            <Download size={14} /> Dışa Aktar (.XLSX)
          </button>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Spreadsheet Main Table */}
      <div className="bg-[#0F1115] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-900/80 text-[10px] uppercase font-black text-slate-500 tracking-widest border-b border-slate-800">
                  <th className="px-6 py-5 border-r border-slate-800 min-w-[120px]">Hisse Kodu</th>
                  <th className="px-6 py-5 border-r border-slate-800 min-w-[100px]">Durum</th>
                  <th className="px-6 py-5 border-r border-slate-800">Alış Fiyatı</th>
                  <th className="px-6 py-5 border-r border-slate-800">Güncel/Satış</th>
                  <th className="px-6 py-5 border-r border-slate-800">Toplam Lot</th>
                  <th className="px-6 py-5 border-r border-slate-800">Toplam Maliyet</th>
                  <th className="px-6 py-5 border-r border-slate-800">Toplam Değer</th>
                  <th className="px-6 py-5">Net Kâr</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
               {MOCK_PARTICIPATION_DATA.map((row, idx) => (
                 <tr key={idx} className="hover:bg-emerald-500/5 transition-colors group">
                    <td className="px-6 py-4 border-r border-slate-800 font-black text-slate-200 uppercase tracking-tighter group-hover:text-emerald-400">
                      {row.symbol}
                    </td>
                    <td className="px-6 py-4 border-r border-slate-800">
                       <span className={cn(
                         "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                         row.status === 'Satıldı' ? "bg-slate-800 text-slate-400" : "bg-emerald-500/10 text-emerald-500"
                       )}>
                          {row.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-800 font-mono text-sm text-slate-400">
                      {row.buyPrice.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4 border-r border-slate-800 font-mono text-sm text-slate-400">
                      {row.sellPrice.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4 border-r border-slate-800 font-mono text-sm text-slate-400">
                      {row.totalLots}
                    </td>
                    <td className="px-6 py-4 border-r border-slate-800 font-mono text-sm text-slate-400">
                      {row.totalCost.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 border-r border-slate-800 font-mono text-sm text-slate-400">
                      {row.totalValue > 0 ? row.totalValue.toLocaleString('tr-TR') : '-'}
                    </td>
                    <td className={cn(
                      "px-6 py-4 font-mono font-bold text-sm",
                      row.netProfit > 0 ? "text-emerald-500" : row.netProfit < 0 ? "text-rose-500" : "text-slate-600"
                    )}>
                      {row.netProfit > 0 ? `+${row.netProfit.toLocaleString('tr-TR')}` : (row.netProfit === 0 ? '-' : row.netProfit.toLocaleString('tr-TR'))}
                    </td>
                 </tr>
               ))}
            </tbody>
            <tfoot>
               <tr className="bg-slate-900 font-black text-slate-100 uppercase tracking-widest border-t-2 border-slate-700">
                  <td colSpan={7} className="px-6 py-6 text-right text-slate-500 italic">Genel Toplam</td>
                  <td className="px-6 py-6 font-mono text-lg text-emerald-400 group-hover:text-glow">
                    ₺{totalNetProfit.toLocaleString('tr-TR')}
                  </td>
               </tr>
            </tfoot>
         </table>
      </div>

      {/* Selected Stock Detail (Family/Account Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Left Side: Summary Table */}
         <div className="bg-[#0F1115] rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-500" /> Analiz: {selectedSymbol}
               </h3>
               <div className="relative">
                  <select 
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-1.5 text-[10px] font-black text-slate-300 appearance-none pr-8 focus:outline-none"
                  >
                     {MOCK_PARTICIPATION_DATA.map(d => <option key={d.symbol} value={d.symbol}>{d.symbol}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
               </div>
            </div>

            <div className="space-y-1 border border-slate-800 rounded-xl overflow-hidden">
               <SummaryRow label="Alış Fiyatı" value="21,10 ₺" />
               <SummaryRow label="Güncel/Satış" value="19,16 ₺" />
               <SummaryRow label="Durumu Göster" value="Satıldı" highlight="bg-slate-800 text-slate-400" />
               <SummaryRow label="Toplam Talep Tutarı" value="46.525,50 ₺" />
               <SummaryRow label="Toplam Verilen Tutar" value="21.416,50 ₺" />
               <SummaryRow label="Kâr Oranı" value="-" highlight="text-slate-600" />
            </div>
         </div>

         {/* Right Side: Account Lists */}
         <div className="bg-[#0F1115] rounded-3xl border border-slate-800 p-8 shadow-2xl overflow-hidden">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <Landmark size={14} className="text-emerald-500" /> Hesap Dağılımı
            </h3>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-xs">
                  <thead>
                     <tr className="bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest">
                        <th className="px-4 py-3 border-r border-blue-500/30">İsim</th>
                        <th className="px-4 py-3 border-r border-blue-500/30">Banka</th>
                        <th className="px-4 py-3 border-r border-blue-500/30">Lot</th>
                        <th className="px-4 py-3 border-r border-blue-500/30">Maliyet</th>
                        <th className="px-4 py-3 border-r border-blue-500/30">Güncel</th>
                        <th className="px-4 py-3">Kâr</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                     {FAMILY_BREAKDOWN.map((person, idx) => (
                       <tr key={idx} className="bg-slate-900/20 hover:bg-slate-800/30 transition-all">
                          <td className="px-4 py-3 border-r border-slate-800 font-bold text-slate-300 italic">{person.name}</td>
                          <td className="px-4 py-3 border-r border-slate-800 text-slate-500 font-medium">{person.bank}</td>
                          <td className="px-4 py-3 border-r border-slate-800 font-mono font-bold text-slate-400">{person.lots}</td>
                          <td className="px-4 py-3 border-r border-slate-800 font-mono text-slate-400">{person.cost.toLocaleString('tr-TR')}</td>
                          <td className="px-4 py-3 border-r border-slate-800 text-slate-700">-</td>
                          <td className="px-4 py-3 text-slate-700">-</td>
                       </tr>
                     ))}
                  </tbody>
                  <tfoot>
                     <tr className="bg-slate-950 font-black text-slate-200">
                        <td colSpan={2} className="px-4 py-4 uppercase tracking-[0.2em] text-[10px]">Toplam</td>
                        <td className="px-4 py-4 font-mono">1015</td>
                        <td className="px-4 py-4 font-mono">21.416,50</td>
                        <td className="px-4 py-4 font-mono text-emerald-500">0,00</td>
                        <td className="px-4 py-4 font-mono text-emerald-500">0,00</td>
                     </tr>
                  </tfoot>
               </table>
            </div>
         </div>
      </div>

      {/* Global Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <SummaryCard icon={<Building2 />} label="Arz Sayısı" value="14" sub="Başarılı Çıkış" color="text-blue-500" />
         <SummaryCard icon={<CircleDollarSign />} label="Toplam Hacim" value="₺56.055" sub="Kümülatif Kâr" color="text-emerald-500" />
         <SummaryCard icon={<TrendingUp />} label="Tahmini Katılım" value="850.000" sub="Sektörel Ort." color="text-amber-500" />
         <SummaryCard icon={<User />} label="Hesap Havuzu" value="8" sub="Aktif Yönetim" color="text-indigo-500" />
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, highlight }: { label: string, value: string, highlight?: string }) => (
  <div className="flex items-center justify-between p-4 bg-slate-900/30 border-b border-slate-800 last:border-0">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <span className={cn("text-xs font-black text-slate-100", highlight)}>{value}</span>
  </div>
);

const SummaryCard = ({ icon, label, value, sub, color }: { icon: React.ReactNode, label: string, value: string, sub: string, color: string }) => (
  <div className="bg-[#0F1115] border border-slate-800 p-6 rounded-3xl shadow-xl group hover:border-emerald-500/30 transition-all">
     <div className={cn("inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-6 group-hover:scale-110 transition-transform", color)}>
        {icon}
     </div>
     <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</h4>
     <div className="text-2xl font-black text-slate-100 italic tracking-tighter mb-1">{value}</div>
     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{sub}</p>
  </div>
);

export default IPOSpreadsheet;
