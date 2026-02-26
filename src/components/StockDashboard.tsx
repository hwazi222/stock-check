"use client";

import { useState } from "react";
import { useStocks } from "@/hooks/useStocks";
import StockCard from "./StockCard";
import MarketStatus from "./MarketStatus";

type Market = "us" | "kr";

const TABS: { key: Market; label: string; flag: string }[] = [
  { key: "us", label: "미국 주식", flag: "US" },
  { key: "kr", label: "한국 주식", flag: "KR" },
];

function formatTime(isoString: string | null): string {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="h-3 w-16 bg-gray-700 rounded mb-2" />
          <div className="h-5 w-24 bg-gray-700 rounded" />
        </div>
        <div className="h-5 w-14 bg-gray-700 rounded-full" />
      </div>
      <div className="mb-4">
        <div className="h-8 w-32 bg-gray-700 rounded mb-1" />
        <div className="h-4 w-28 bg-gray-700 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-8 bg-gray-700 rounded" />
        <div className="h-8 bg-gray-700 rounded" />
        <div className="h-8 bg-gray-700 rounded" />
        <div className="h-8 bg-gray-700 rounded" />
      </div>
    </div>
  );
}

export default function StockDashboard() {
  const [activeTab, setActiveTab] = useState<Market>("us");
  const { stocks, updatedAt, isLoading, isError, refresh } = useStocks(activeTab);

  const marketState = stocks.length > 0 ? stocks[0].marketState : "CLOSED";
  const marketType = activeTab === "us" ? "US" : "KR";

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex bg-gray-800 rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <MarketStatus marketState={marketState} market={marketType} />
          <button
            onClick={refresh}
            className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1 rounded border border-gray-700 hover:border-gray-500"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* Update Time */}
      <div className="mb-4 text-xs text-gray-500">
        마지막 갱신: {formatTime(updatedAt)} (30초마다 자동 갱신)
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">
            데이터를 불러오는 데 실패했습니다. 잠시 후 자동으로 재시도합니다.
          </p>
        </div>
      )}

      {/* Stock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: activeTab === "us" ? 7 : 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : stocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
      </div>
    </div>
  );
}
