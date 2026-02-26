import StockDashboard from "@/components/StockDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                Stock Tracker
              </h1>
              <p className="text-sm text-gray-400">
                미국 & 한국 인기 주식 실시간 시세
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StockDashboard />
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 text-center">
            Yahoo Finance 데이터 기반 | 30초마다 자동 갱신 | 투자 참고용으로만 사용하세요
          </p>
        </div>
      </footer>
    </div>
  );
}
