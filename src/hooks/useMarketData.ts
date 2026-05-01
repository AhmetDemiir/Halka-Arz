import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useMarketData = () => {
  const { marketData, updateMarketPrices, portfolio } = useStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const updates = marketData.map(stock => {
        // simulation: fluctuate between -0.3% and +0.3% every 2 seconds
        const fluctuation = 1 + (Math.random() * 0.006 - 0.003);
        return {
          ticker: stock.ticker,
          price: Number((stock.price * fluctuation).toFixed(2))
        };
      });

      updateMarketPrices(updates);
    }, 2000); // 2 seconds for smooth "instant" feeling

    return () => clearInterval(interval);
  }, [marketData, updateMarketPrices]);

  // Derived state: Total Portfolio Value
  const activePortfolioItems = portfolio.filter(p => p.status === 'ACTIVE');
  const totalPortfolioValue = activePortfolioItems.reduce((acc, item) => {
    const marketStock = marketData.find(s => s.ticker === item.ticker);
    const currentPrice = marketStock ? marketStock.price : item.buyPrice;
    return acc + (currentPrice * item.lots);
  }, 0);

  const totalCost = activePortfolioItems.reduce((acc, item) => acc + (item.buyPrice * item.lots), 0);
  const unrealizedProfit = totalPortfolioValue - totalCost;

  return { 
    marketData, 
    totalPortfolioValue, 
    unrealizedProfit,
    activePortfolioItems 
  };
};
