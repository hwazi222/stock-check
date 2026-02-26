import { StockQuote } from "@/lib/types";

function formatPrice(price: number | null, currency: string): string {
  if (price === null) return "-";
  if (currency === "KRW") {
    return price.toLocaleString("ko-KR") + "원";
  }
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatChange(change: number | null, currency: string): string {
  if (change === null) return "-";
  const sign = change >= 0 ? "+" : "";
  if (currency === "KRW") {
    return sign + change.toLocaleString("ko-KR") + "원";
  }
  return sign + "$" + Math.abs(change).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(percent: number | null): string {
  if (percent === null) return "-";
  const sign = percent >= 0 ? "+" : "";
  return sign + percent.toFixed(2) + "%";
}

function formatVolume(volume: number | null): string {
  if (volume === null) return "-";
  if (volume >= 1_000_000_000) return (volume / 1_000_000_000).toFixed(1) + "B";
  if (volume >= 1_000_000) return (volume / 1_000_000).toFixed(1) + "M";
  if (volume >= 1_000) return (volume / 1_000).toFixed(1) + "K";
  return volume.toLocaleString();
}

function formatMarketCap(cap: number | null, currency: string): string {
  if (cap === null) return "-";
  if (currency === "KRW") {
    if (cap >= 1_000_000_000_000) return (cap / 1_000_000_000_000).toFixed(1) + "조";
    if (cap >= 100_000_000) return (cap / 100_000_000).toFixed(0) + "억";
    return cap.toLocaleString("ko-KR") + "원";
  }
  if (cap >= 1_000_000_000_000) return "$" + (cap / 1_000_000_000_000).toFixed(2) + "T";
  if (cap >= 1_000_000_000) return "$" + (cap / 1_000_000_000).toFixed(1) + "B";
  if (cap >= 1_000_000) return "$" + (cap / 1_000_000).toFixed(1) + "M";
  return "$" + cap.toLocaleString();
}

export default function StockCard({ stock }: { stock: StockQuote }) {
  if (stock.error) {
    return (
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-sm text-gray-400 font-mono">{stock.symbol}</span>
            <h3 className="text-white font-semibold">{stock.name}</h3>
          </div>
        </div>
        <p className="text-red-400 text-sm">{stock.error}</p>
      </div>
    );
  }

  const isPositive = (stock.change ?? 0) >= 0;
  const colorClass = isPositive ? "text-green-400" : "text-red-400";
  const bgColorClass = isPositive ? "bg-green-400/10" : "bg-red-400/10";

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs text-gray-400 font-mono">{stock.symbol}</span>
          <h3 className="text-white font-semibold text-lg">{stock.name}</h3>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${bgColorClass} ${colorClass}`}
        >
          {formatPercent(stock.changePercent)}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-white">
          {formatPrice(stock.price, stock.currency)}
        </p>
        <p className={`text-sm font-medium ${colorClass}`}>
          {formatChange(stock.change, stock.currency)} ({formatPercent(stock.changePercent)})
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
        <div>
          <span className="block text-gray-500">시가</span>
          {formatPrice(stock.open, stock.currency)}
        </div>
        <div>
          <span className="block text-gray-500">전일종가</span>
          {formatPrice(stock.previousClose, stock.currency)}
        </div>
        <div>
          <span className="block text-gray-500">거래량</span>
          {formatVolume(stock.volume)}
        </div>
        <div>
          <span className="block text-gray-500">시가총액</span>
          {formatMarketCap(stock.marketCap, stock.currency)}
        </div>
      </div>
    </div>
  );
}
