import { IPO, IPOStatus, DistributionMethod, BankAccount, StockData } from './types';

export const MOCK_IPOS: IPO[] = [
  {
    id: 'ipo-1',
    name: 'Rönesans Enerji',
    ticker: 'RNESC',
    price: 135.0,
    startDate: '2026-05-02',
    endDate: '2026-05-04',
    status: IPOStatus.ACTIVE,
    distributionMethod: DistributionMethod.INDIVIDUAL_EQUAL,
    summary: 'Enerji sektöründe dev yatırım fırsatı.',
    expectedLot: 25,
    marketValue: 12500000000,
  },
  {
    id: 'ipo-2',
    name: 'Koton Mağazacılık',
    ticker: 'KOTON',
    price: 30.5,
    startDate: '2026-04-28',
    endDate: '2026-04-30',
    status: IPOStatus.COMPLETED,
    distributionMethod: DistributionMethod.EQUAL,
    summary: 'Perakende tekstil lideri halka açılıyor.',
    expectedLot: 40,
    marketValue: 8000000000,
  },
  {
    id: 'ipo-3',
    name: 'Mogan Enerji',
    ticker: 'MOGAN',
    price: 11.33,
    startDate: '2026-05-15',
    endDate: '2026-05-17',
    status: IPOStatus.UPCOMING,
    distributionMethod: DistributionMethod.INDIVIDUAL_EQUAL,
    summary: 'Yenilenebilir enerji odaklı büyüme stratejisi.',
    expectedLot: 100,
    marketValue: 4500000000,
  },
];

export const MOCK_BANKS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'Ziraat Bankası',
    accountName: 'Ana Yatırım Hesabı',
    balance: 45200.5,
    stockBalance: 125000.0,
    ipoBalance: 5000.0,
  },
  {
    id: 'bank-2',
    bankName: 'Garanti BBVA',
    accountName: 'Yedek Portföy',
    balance: 15400.0,
    stockBalance: 32000.0,
    ipoBalance: 2500.0,
  },
  {
    id: 'bank-3',
    bankName: 'İş Bankası',
    accountName: 'Birikim',
    balance: 8900.25,
    stockBalance: 0,
    ipoBalance: 0,
  },
];

export const MOCK_STOCKS: StockData[] = [
  {
    ticker: 'THYAO',
    price: 312.5,
    change: 2.4,
    volume: 1200000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 300 + Math.random() * 15 })),
  },
  {
    ticker: 'EREGL',
    price: 45.12,
    change: -0.8,
    volume: 850000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 44 + Math.random() * 2 })),
  },
  {
    ticker: 'ASELS',
    price: 62.3,
    change: 1.2,
    volume: 500000,
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 60 + Math.random() * 5 })),
  },
];
