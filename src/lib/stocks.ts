import { StockInfo } from "./types";

export const US_STOCKS: StockInfo[] = [
  { symbol: "AAPL", name: "애플", market: "US" },
  { symbol: "GOOGL", name: "알파벳 (구글)", market: "US" },
  { symbol: "MSFT", name: "마이크로소프트", market: "US" },
  { symbol: "TSLA", name: "테슬라", market: "US" },
  { symbol: "NVDA", name: "엔비디아", market: "US" },
  { symbol: "AMZN", name: "아마존", market: "US" },
  { symbol: "META", name: "메타 (페이스북)", market: "US" },
];

export const KR_STOCKS: StockInfo[] = [
  { symbol: "005930.KS", name: "삼성전자", market: "KR" },
  { symbol: "000660.KS", name: "SK하이닉스", market: "KR" },
  { symbol: "035420.KS", name: "네이버", market: "KR" },
  { symbol: "035720.KS", name: "카카오", market: "KR" },
  { symbol: "005380.KS", name: "현대자동차", market: "KR" },
  { symbol: "373220.KS", name: "LG에너지솔루션", market: "KR" },
];
