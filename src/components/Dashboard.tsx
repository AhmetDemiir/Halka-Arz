import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, Landmark, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { MOCK_BANKS, MOCK_IPOS } from '../constants';
import { formatCurrency, cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMarketData } from '../hooks/useMarketData';

const Dashboard: React.FC = () => {
  const { totalPortfolioValue, unrealizedProfit, marketData } = useMarketData();
  
  if (!marketData.length) {
    return <DashboardSkeleton />;
  }

  const totalCash = MOCK_BANKS.reduce((acc, curr) => acc + curr.balance, 0);
  const totalBalance = totalPortfolioValue + totalCash;

  const data = [
    { name: 'Nakit', value: totalCash, color: '#94a3b8' },
    { name: 'Portföy', value: totalPortfolioValue, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Genel Bakış</h2>
        <p className="text-slate-500 text-sm font-medium">Hesaplarınızdaki toplam varlık durumu ve piyasa özeti.</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Toplam Varlık" 
          value={formatCurrency(totalBalance)} 
          icon={<Wallet size={18} className="text-emerald-500" />}
          trend="+4.2%"
          positive={true}
        />
        <StatCard 
          title="Toplam Nakit" 
          value={formatCurrency(totalCash)} 
          icon={<Landmark size={18} className="text-slate-400" />}
          trend="+1.2%"
          positive={true}
        />
        <StatCard 
          title="Anlık Kâr/Zarar" 
          value={formatCurrency(unrealizedProfit)} 
          icon={<TrendingUp size={18} className="text-amber-400" />}
          trend={`${unrealizedProfit >= 0 ? '+' : ''}${((unrealizedProfit / totalPortfolioValue) * 100).toFixed(2)}%`}
          positive={unrealizedProfit >= 0}
        />
        <StatCard 
          title="Aktif Halka Arz" 
          value={formatCurrency(marketData.reduce((acc, s) => acc + (s.price * 10), 0))} // Mocking IPO presence
          icon={<RocketIcon />}
          trend="2 Aktif"
          positive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset Distribution */}
        <div className="lg:col-span-2 bg-[#0F1115] p-6 rounded-2xl border border-slate-800 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs uppercase text-slate-500 font-bold tracking-tighter flex items-center gap-2">
              <PieChartIcon size={14} className="text-emerald-500" />
              Varlık Dağılım Analizi
            </h3>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Konsolide Veri</span>
          </div>
          
          <div className="flex-1 min-h-[300px] flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 h-[260px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-bold text-emerald-500">65%</span>
                 <span className="text-[8px] uppercase text-slate-500 font-bold tracking-widest">Arz Payı</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-5">
              {data.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.name}</span>
                    </div>
                    <span className="text-sm font-mono text-slate-200">
                      {((item.value / totalBalance) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-1 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / totalBalance) * 100}%` }}
                      className="h-full" 
                      style={{ backgroundColor: item.color }} 
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bank Balances */}
        <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 shadow-xl text-slate-200">
          <h3 className="text-xs uppercase text-slate-500 font-bold mb-6 tracking-tighter flex items-center gap-2">
            <Landmark size={14} className="text-emerald-500" />
            Bağlı Banka Hesapları
          </h3>
          <div className="space-y-4">
            {MOCK_BANKS.map((bank, index) => (
              <motion.div 
                key={bank.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-3 rounded-xl border border-slate-800/50 bg-slate-800/20 hover:bg-slate-800/40 transition-all cursor-pointer group border-l-2",
                  index === 0 ? "border-l-rose-500" : index === 1 ? "border-l-blue-500" : "border-l-emerald-500"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{bank.bankName}</span>
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{bank.accountName}</span>
                  </div>
                  <span className="font-mono text-lg text-slate-200">{formatCurrency(bank.balance + bank.stockBalance + bank.ipoBalance)}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-600/20 transition-all cursor-pointer">
            Hesapları Senkronize Et
          </button>
        </div>
      </div>

      {/* Recent Market Info */}
      <div className="bg-[#0F1115] rounded-2xl border border-slate-800 p-6 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs uppercase text-slate-500 font-bold tracking-tighter flex items-center gap-2">
              <Activity size={14} className="text-emerald-500" />
              Canlı İzleme Listesi & Sinyaller
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Veri Akışı Aktif</span>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketData.slice(0, 6).map((stock) => (
              <MarketRow key={stock.ticker} stock={stock} />
            ))}
         </div>
      </div>
    </div>
  );
};

const MarketRow = ({ stock }: { stock: any }) => {
  const isUp = stock.lastPrice ? stock.price > stock.lastPrice : null;
  const flashClass = isUp === true ? 'animate-flash-up' : isUp === false ? 'animate-flash-down' : '';

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/30 transition-all cursor-pointer group",
      flashClass
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold group-hover:border-emerald-500/50 transition-colors">
          {stock.ticker[0]}
        </div>
        <div>
          <span className="block font-bold text-slate-200">{stock.ticker}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{stock.name}</span>
        </div>
      </div>
      <div className="text-right">
        <span className="block font-mono font-bold text-slate-200">{formatCurrency(stock.price)}</span>
        <div className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-1",
          stock.change >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
        )}>
          {stock.change >= 0 ? '+' : ''}{stock.change}%
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse p-4">
    <div className="h-8 w-48 bg-slate-800 rounded-lg mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-[400px] bg-slate-900 rounded-2xl border border-slate-800" />
      <div className="h-[400px] bg-slate-900 rounded-2xl border border-slate-800" />
    </div>
  </div>
);

const StatCard = ({ title, value, icon, trend, positive }: { title: string, value: string, icon: React.ReactNode, trend: string, positive: boolean }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl transition-all"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 group-hover:border-emerald-500/50">
        {icon}
      </div>
      <div className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center uppercase tracking-wider",
        positive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
      )}>
        {trend}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
      <h4 className="text-2xl font-light text-slate-100 font-mono tracking-tight">{value}</h4>
    </div>
  </motion.div>
);

const RocketIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-4 5-4"/>
        <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 4-5 4-5"/>
    </svg>
)

export default Dashboard;
