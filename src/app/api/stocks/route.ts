import { NextRequest, NextResponse } from "next/server";
import { US_STOCKS, KR_STOCKS } from "@/lib/stocks";
import { StockQuote, StockApiResponse, StockInfo } from "@/lib/types";
import { MOCK_US_STOCKS, MOCK_KR_STOCKS } from "@/lib/mock-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedYf: any = null;

async function getYf() {
  if (cachedYf) return cachedYf;
  const mod = await import("yahoo-finance2");
  const YahooFinance = mod.default;
  cachedYf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
  return cachedYf;
}

async function fetchQuote(stock: StockInfo): Promise<StockQuote> {
  const yf = await getYf();
  const quote = await yf.quote(stock.symbol);
  return {
    symbol: stock.symbol,
    name: stock.name,
    market: stock.market,
    price: quote.regularMarketPrice ?? null,
    change: quote.regularMarketChange ?? null,
    changePercent: quote.regularMarketChangePercent ?? null,
    currency: quote.currency ?? (stock.market === "KR" ? "KRW" : "USD"),
    marketState: quote.marketState ?? "CLOSED",
    previousClose: quote.regularMarketPreviousClose ?? null,
    open: quote.regularMarketOpen ?? null,
    dayHigh: quote.regularMarketDayHigh ?? null,
    dayLow: quote.regularMarketDayLow ?? null,
    volume: quote.regularMarketVolume ?? null,
    marketCap: quote.marketCap ?? null,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") || "us";

  const stockList = market === "kr" ? KR_STOCKS : US_STOCKS;
  const mockData = market === "kr" ? MOCK_KR_STOCKS : MOCK_US_STOCKS;

  try {
    const results = await Promise.allSettled(
      stockList.map((stock) => fetchQuote(stock))
    );

    const stocks: StockQuote[] = results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      const stock = stockList[index];
      return {
        symbol: stock.symbol,
        name: stock.name,
        market: stock.market,
        price: null,
        change: null,
        changePercent: null,
        currency: stock.market === "KR" ? "KRW" : "USD",
        marketState: "CLOSED",
        previousClose: null,
        open: null,
        dayHigh: null,
        dayLow: null,
        volume: null,
        marketCap: null,
        error: "데이터를 불러올 수 없습니다",
      };
    });

    // 모든 종목이 실패하면 샘플 데이터 반환
    const allFailed = stocks.every((s) => s.error);
    if (allFailed) {
      console.warn("Yahoo Finance API 연결 실패 - 샘플 데이터를 반환합니다.");
      const response: StockApiResponse = {
        stocks: mockData,
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json(response);
    }

    const response: StockApiResponse = {
      stocks,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Yahoo Finance API 오류:", error);
    const response: StockApiResponse = {
      stocks: mockData,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(response);
  }
}
