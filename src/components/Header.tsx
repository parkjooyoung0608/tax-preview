import React from "react";

export default function Header({ onClickReset }: { onClickReset: () => void }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">연말정산 미리보기</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
            MVP
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClickReset}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm shadow"
          >
            리셋
          </button>
        </div>
      </div>
    </header>
  );
}
