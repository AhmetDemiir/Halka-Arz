import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface MarketStock {
  ticker: string;
  name: string;
  price: number;
  openPrice: number;
  change: number;
  lastPrice?: number; // For flash effect
}

interface PortfolioItem {
  id: string;
  ticker: string;
  name: string;
  status: 'ACTIVE' | 'SOLD';
  buyPrice: number;
  sellPrice?: number;
  lots: number;
  accounts: {
    name: string;
    bank: string;
    lots: number;
    cost: number;
  }[];
}

interface AppState {
  theme: 'light' | 'dark' | 'system';
  user: UserProfile | null;
  marketData: MarketStock[];
  portfolio: PortfolioItem[];
  userAccounts: { id: string; name: string; bank: string }[];
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setUser: (user: UserProfile | null) => void;
  updateMarketPrices: (updates: { ticker: string; price: number }[]) => void;
  togglePortfolioStatus: (id: string, sellPrice?: number) => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  removePortfolioItem: (id: string) => void;
  addAccount: (acc: { id: string; name: string; bank: string }) => void;
  removeAccount: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      user: null,
      marketData: [
        { ticker: 'THYAO', name: 'Türk Hava Yolları', price: 285.50, openPrice: 285.50, change: 0 },
        { ticker: 'ASELS', name: 'Aselsan', price: 54.20, openPrice: 54.20, change: 0 },
        { ticker: 'EREGL', name: 'Erdemir', price: 42.15, openPrice: 42.15, change: 0 },
        { ticker: 'KCHOL', name: 'Koç Holding', price: 185.30, openPrice: 185.30, change: 0 },
        { ticker: 'RNESC', name: 'Rönesans Gayrimenkul', price: 135.00, openPrice: 135.00, change: 0 },
        { ticker: 'KOTON', name: 'Koton Mağazacılık', price: 30.50, openPrice: 30.50, change: 0 },
      ],
      portfolio: [],
      userAccounts: [
        { id: '1', name: 'Asıl Hesap', bank: 'Ziraat' },
        { id: '2', name: 'Yedek Hesap', bank: 'Garanti' },
      ],

      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user }),
      
      updateMarketPrices: (updates) => set((state) => ({
        marketData: state.marketData.map((stock) => {
          const update = updates.find((u) => u.ticker === stock.ticker);
          if (update) {
            const newPrice = update.price;
            const openPrice = stock.openPrice || newPrice;
            const change = Number(((newPrice - openPrice) / openPrice * 100).toFixed(2));
            return {
              ...stock,
              lastPrice: stock.price,
              price: newPrice,
              openPrice: openPrice,
              change: change,
            };
          }
          return stock;
        }),
      })),

      togglePortfolioStatus: (id, sellPrice) => set((state) => ({
        portfolio: state.portfolio.map((item) => 
          item.id === id 
            ? { ...item, status: item.status === 'ACTIVE' ? 'SOLD' : 'ACTIVE', sellPrice: sellPrice || item.sellPrice } 
            : item
        )
      })),

      addPortfolioItem: (item) => set((state) => {
        const existingIndex = state.portfolio.findIndex(p => p.ticker === item.ticker && p.status === 'ACTIVE');
        if (existingIndex > -1) {
          const updatedPortfolio = [...state.portfolio];
          const existing = updatedPortfolio[existingIndex];
          
          // Add new account to list
          const updatedAccounts = [...existing.accounts, ...item.accounts];
          
          // Calculate new totals
          const totalLots = updatedAccounts.reduce((acc, a) => acc + a.lots, 0);
          const totalCost = updatedAccounts.reduce((acc, a) => acc + (a.lots * a.cost), 0);
          const avgPrice = totalCost / totalLots;

          updatedPortfolio[existingIndex] = {
            ...existing,
            lots: totalLots,
            buyPrice: avgPrice,
            accounts: updatedAccounts
          };
          
          return { portfolio: updatedPortfolio };
        }
        return { portfolio: [...state.portfolio, item] };
      }),

      removePortfolioItem: (id) => set((state) => ({
        portfolio: state.portfolio.filter(p => p.id !== id)
      })),

      addAccount: (acc) => set((state) => ({
        userAccounts: [...state.userAccounts, acc]
      })),

      removeAccount: (id) => set((state) => ({
        userAccounts: state.userAccounts.filter(a => a.id !== id)
      })),
    }),
    {
      name: 'arzplus-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        portfolio: state.portfolio, 
        userAccounts: state.userAccounts,
        marketData: state.marketData 
      }),
    }
  )
);
