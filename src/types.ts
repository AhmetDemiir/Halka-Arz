export enum IPOStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum DistributionMethod {
  EQUAL = 'EŞİT',
  INDIVIDUAL_EQUAL = 'BİREYSEL EŞİT',
  PROPORTIONAL = 'ORANSAL',
}

export interface IPO {
  id: string;
  name: string;
  ticker: string;
  price: number;
  startDate: string;
  endDate: string;
  status: IPOStatus;
  distributionMethod: DistributionMethod;
  summary: string;
  expectedLot?: number;
  participationLimit?: number;
  marketValue?: number;
  logoUrl?: string;
  payoutHistory?: { date: string; amount: number }[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  balance: number;
  stockBalance: number;
  ipoBalance: number;
  logoUrl?: string;
}

export interface Participation {
  id: string;
  ipoId: string;
  accountId: string;
  amount: number;
  lotRequested: number;
  lotAllocated?: number;
  date: string;
}

export interface StockData {
  ticker: string;
  price: number;
  change: number;
  volume: number;
  history: { time: string; price: number }[];
}
