import Tag from "@components/Tag";

export default function Header({ onClickReset }: { onClickReset: () => void }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">연말정산 미리보기</span>
          <Tag title="MVP" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClickReset}
            className="px-3 py-1.5 rounded-xl bg-brand-red hover:bg-rose-700 text-white text-sm shadow"
          >
            리셋
          </button>
        </div>
      </div>
    </header>
  );
}
