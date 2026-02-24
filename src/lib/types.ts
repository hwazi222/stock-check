export interface StockInfo {
  symbol: string;
  name: string;
  market: "US" | "KR";
}

export interface StockQuote {
  symbol: string;
  name: string;
  market: "US" | "KR";
  price: number | null;
  change: number | null;
  changePercent: number | null;
  currency: string;
  marketState: string;
  previousClose: number | null;
  open: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  volume: number | null;
  marketCap: number | null;
  error?: string;
}

export interface StockApiResponse {
  stocks: StockQuote[];
  updatedAt: string;
}
