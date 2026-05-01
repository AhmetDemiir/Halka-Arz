import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Bot, User, Loader2, Rocket, TrendingUp, ShieldCheck, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { useMarketData } from '../hooks/useMarketData';
import { MOCK_IPOS } from '../constants';

const AIAssistant: React.FC = () => {
  const { portfolio, marketData } = useStore();
  const { totalPortfolioValue, unrealizedProfit } = useMarketData();
  
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: "# Selam! Ben ArzPlus Strateji Ortağın. \n\nPortföyünü analiz ettim. Şu anki varlığın ve piyasa koşullarına göre sana özel çeşitlendirme ve risk yönetimi önerileri hazırlayabilirim. \n\n**Analiz etmemi istediğin spesifik bir hisse var mı yoksa portföy rebalancing önerilerimi mi istersin?**" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAnalyze = (e: any) => {
      const ticker = e.detail;
      const stock = marketData.find(s => s.ticker === ticker);
      const item = portfolio.find(p => p.ticker === ticker);
      
      const customPrompt = `Piyasa verileri şuan: ${ticker} hissesi ${stock?.price} TL seviyesinde. 
      Portföyümde ${item?.lots} adet var. 
      Lütfen bu hisse için bir "Tavan Bozma Tahmini" yap. 
      Şu verileri düşün: Bireysel yatırımcı ilgisi, halka arz büyüklüğü ve bugünkü hacim. 
      Tahmini bir gün ve olasılık (%) ver.`;
      
      setInput(customPrompt);
      // Optional: Auto-trigger send
    };

    window.addEventListener('analyze-stock', handleAnalyze);
    return () => window.removeEventListener('analyze-stock', handleAnalyze);
  }, [marketData, portfolio]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const portfolioContext = portfolio.map(p => ({
        ticker: p.ticker,
        status: p.status,
        lots: p.lots,
        avgCost: p.buyPrice,
        currentValue: (marketData.find(m => m.ticker === p.ticker)?.price || p.buyPrice) * p.lots
      }));

      const systemInstruction = `Sen ArzPlus AI isimli, Borsa İstanbul (BIST) ve Halka Arz uzmanı bir finansal analiz asistanısın. 
      Kullanıcının portföyündeki verileri kullanarak (Portföy: ${JSON.stringify(portfolioContext)}, Toplam Değer: ${totalPortfolioValue}, Anlık K/Z: ${unrealizedProfit}) şu konularda derinlemesine analiz yap:
      1. Çeşitlendirme Stratejileri: Portföydeki yoğunlaşma riskini analiz et.
      2. Rebalancing: Hangi hisselerde kar satışı yapılmalı, hangilerinde ekleme yapılmalı?
      3. Tavan Tahmini: Portföyündeki halka arzların tavan bozma potansiyellerini hesapla.
      
      Eğer kullanıcı spesifik bir hisse sorduysa (mesela Tavan Bozma Tahmini), o hissenin son piyasa fiyatı ${JSON.stringify(marketData.map(m => ({ t: m.ticker, p: m.price })))} ve halka arz özelliklerini göz önüne alarak simülasyon yap.
      
      Tahminlerini her zaman şu bölümleri içerek şekilde sun:
      - Tavan Bozma İhtimali: %X
      - Tahmini Tavan Günü: Y. Gün
      - Nedenler: (3 Madde)
      
      Kurallar:
      - Sektörel dağılım (bankacılık, sanayi, teknoloji vb.) üzerine yorum yap.
      - Kullanıcının "ArzPlus" platformunda olduğunu unutma.
      - Üslubun vizyoner ve veri odaklı olsun.
      - Cevabın sonunda her zaman şık bir italic "Yatırım Tavsiyesi Değildir" uyarısı ekle.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });

      const aiText = response.text || "Üzgünüm, şu an analiz motorlarımda bir yoğunluk var. Lütfen birazdan tekrar dene.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: "Stratejik verilere erişirken bir kopukluk yaşandı. Lütfen bağlantını kontrol et." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">AI Strateji Merkezi</h2>
          <p className="text-slate-500 text-sm font-medium">Yapay zeka destekli tavan tahmini ve portföy optimizasyonu.</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">AI Çekirdek Aktif</span>
           </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
        {/* Chat Area */}
        <div className="lg:col-span-3 bg-[#0F1115] border border-slate-800 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
           
           <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border",
                    msg.role === 'ai' ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "bg-slate-900 text-slate-400 border-slate-800"
                  )}>
                    {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'ai' ? "bg-slate-900/50 border border-slate-800 text-slate-300" : "bg-emerald-600 text-white font-medium"
                  )}>
                    <div className="markdown-body prose prose-invert prose-emerald max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center animate-pulse">
                    <Bot size={20} />
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                    <Loader2 size={20} className="animate-spin text-emerald-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           <div className="p-6 border-t border-slate-800 bg-slate-900/20">
              <div className="relative group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Halka arz analizi isteyin... (Örn: RNESC ne zaman tavan bozar?)"
                  className="w-full bg-[#0A0B0D] border border-slate-800 rounded-2xl pl-6 pr-16 py-4 text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
           </div>
        </div>

        {/* Sidebar / Stats */}
        <div className="hidden lg:flex flex-col gap-6">
           <div className="bg-[#0F1115] border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Rocket size={14} className="text-emerald-500" /> Tahminsel Skorlar
              </h3>
              <div className="space-y-6">
                 {MOCK_IPOS.slice(0, 2).map((ipo, idx) => (
                   <div key={ipo.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-black text-slate-300">{ipo.ticker}</span>
                         <span className="text-[10px] font-black text-emerald-400">{85 - idx * 10}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${85 - idx * 10}%` }}
                           className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" 
                         />
                      </div>
                      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">Tavan Potansiyeli: 7-9 Gün</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                 <ShieldCheck size={24} />
              </div>
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Güvenli Analiz</h4>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                Asistanımız finansal raporları, sosyal medya duyarlılığını ve emir defteri derinliğini saniyeler içinde analiz eder.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
