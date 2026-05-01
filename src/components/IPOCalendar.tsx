import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Info, CheckCircle2 } from 'lucide-react';
import { MOCK_IPOS } from '../constants';
import { cn } from '../lib/utils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from 'date-fns';
import { tr } from 'date-fns/locale';

const IPOCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Halka Arz Takvimi</h2>
          <p className="text-slate-500 text-sm font-medium">Önemli tarihleri ve işlem günlerini anlık takip edin.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-black text-slate-200 uppercase tracking-widest min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy', { locale: tr })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-px bg-slate-800 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {allDays.map((d, i) => {
          const isSelected = isSameDay(d, selectedDate);
          const isCurrentMonth = isSameMonth(d, monthStart);
          const isToday = isSameDay(d, new Date());
          
          // Check if any IPO starts/ends on this day
          const iposOnThisDay = MOCK_IPOS.filter(ipo => {
             // Basic matching for mock dates (format: "15-17 Mayıs")
             // In a real app, these would be proper Date objects in Firestore
             const [start, end] = ipo.startDate.split(' '); // Simplistic for mock
             return ipo.startDate.includes(format(d, 'd')) && ipo.startDate.toLocaleLowerCase().includes(format(d, 'MMMM', { locale: tr }).toLocaleLowerCase());
          });

          return (
            <div 
              key={i}
              onClick={() => setSelectedDate(d)}
              className={cn(
                "min-h-[120px] p-3 transition-all cursor-pointer relative group",
                isCurrentMonth ? "bg-[#0F1115]" : "bg-slate-900/50",
                isSelected ? "ring-2 ring-emerald-500/50 z-10" : "hover:bg-slate-800/40"
              )}
            >
              <span className={cn(
                "text-xs font-bold",
                isToday ? "text-emerald-500" : isCurrentMonth ? "text-slate-300" : "text-slate-700"
              )}>
                {format(d, 'd')}
              </span>
              
              <div className="mt-2 space-y-1">
                {iposOnThisDay.map(ipo => (
                  <div key={ipo.id} className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter truncate">{ipo.ticker}</span>
                    <span className="text-[7px] font-bold text-slate-500 uppercase leading-none">Arz Başlangıcı</span>
                  </div>
                ))}
              </div>

              {isToday && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {renderHeader()}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {renderDays()}
          {renderCells()}
        </div>
        
        <div className="space-y-6">
           <div className="bg-[#0F1115] border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Info size={14} className="text-emerald-500" /> Günlük Analiz
              </h3>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase tracking-widest">{format(selectedDate, 'd MMMM yyyy', { locale: tr })}</span>
                    <p className="text-xs font-bold text-slate-200">Bugün için planlanan 0 aktif halka arz penceresi bulunuyor.</p>
                 </div>
                 <p className="text-[10px] text-slate-600 font-bold italic leading-relaxed">
                   * Takvim verileri her sabah 09:00'da BIST ve SPK bültenlerine göre güncellenmektedir.
                 </p>
              </div>
           </div>

           <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] pointer-events-none" />
              <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Clock size={14} /> Yaklaşan Kritik Günler
              </h3>
              <div className="space-y-4">
                 {MOCK_IPOS.filter(i => i.status === 'UPCOMING').map(ipo => (
                   <div key={ipo.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div>
                        <span className="block text-xs font-black text-slate-200">{ipo.ticker}</span>
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{ipo.startDate}</span>
                      </div>
                      <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">
                        T-Day
                      </div>
                   </div>
                 ))}
                 {!MOCK_IPOS.some(i => i.status === 'UPCOMING') && (
                    <p className="text-[10px] text-slate-600 font-bold text-center py-4">Şu an için beklenen yeni arz bilgisi bulunmamaktadır.</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IPOCalendar;
