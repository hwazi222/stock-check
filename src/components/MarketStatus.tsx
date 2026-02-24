interface MarketStatusProps {
  marketState: string;
  market: "US" | "KR";
}

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  REGULAR: { label: "장 진행 중", color: "bg-green-500" },
  PRE: { label: "프리마켓", color: "bg-yellow-500" },
  POST: { label: "애프터마켓", color: "bg-orange-500" },
  POSTPOST: { label: "장 마감", color: "bg-gray-500" },
  PREPRE: { label: "장 마감", color: "bg-gray-500" },
  CLOSED: { label: "장 마감", color: "bg-gray-500" },
};

export default function MarketStatus({ marketState, market }: MarketStatusProps) {
  const marketName = market === "US" ? "미국" : "한국";
  const state = STATE_LABELS[marketState] ?? STATE_LABELS.CLOSED;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <span className={`w-2 h-2 rounded-full ${state.color}`} />
      <span>
        {marketName} 시장: <span className="text-gray-300">{state.label}</span>
      </span>
    </div>
  );
}
