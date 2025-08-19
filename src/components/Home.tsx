export default function HomeScreen({
  onStart,
}: {
  onStart: () => Promise<boolean>;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 px-4">
      {/* 로고 / 제목 */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-3 text-emerald-800 dark:text-emerald-400">
          연말정산 미리보기
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          쉽고 빠른 예상 환급금 계산 서비스
        </p>
      </header>

      {/* 서비스 소개 카드 */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-xl border border-gray-200 dark:border-gray-700 mb-10 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-emerald-700 dark:text-emerald-300">
          서비스 소개
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300 text-base">
          <li>
            총급여와 공제 항목을 입력하면 예상 환급금과 추징액을 계산합니다.
          </li>
          <li>각 항목별 세금 비중을 시각화하여 한눈에 이해할 수 있습니다.</li>
          <li>시뮬레이션 기능으로 다양한 시나리오를 실시간 확인 가능합니다.</li>
          <li>간단한 UI로 누구나 빠르게 연말정산을 확인할 수 있습니다.</li>
        </ul>
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={onStart}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        환급금 계산 시작하기
      </button>
    </div>
  );
}
