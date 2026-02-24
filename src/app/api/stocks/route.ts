import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { US_STOCKS, KR_STOCKS } from "@/lib/stocks";
import { StockQuote, StockApiResponse, StockInfo } from "@/lib/types";

const yahooFinance = new YahooFinance();

async function fetchQuote(stock: StockInfo): Promise<StockQuote> {
  try {
    const quote = await yahooFinance.quote(stock.symbol);
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
  } catch {
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
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") || "us";

  const stockList = market === "kr" ? KR_STOCKS : US_STOCKS;

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

    const response: StockApiResponse = {
      stocks,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "주식 데이터를 불러오는 데 실패했습니다" },
      { status: 500 }
    );
  }
}
