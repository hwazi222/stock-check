"use client";

import useSWR from "swr";
import { StockApiResponse } from "@/lib/types";

const fetcher = (url: string): Promise<StockApiResponse> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch stock data");
    return res.json();
  });

export function useStocks(market: "us" | "kr") {
  const { data, error, isLoading, mutate } = useSWR<StockApiResponse>(
    `/api/stocks?market=${market}`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    stocks: data?.stocks ?? [],
    updatedAt: data?.updatedAt ?? null,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
}
