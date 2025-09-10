import formatKoreanCurrency from "@utils/formatKoreanCurrency";
import { ITaxDeductionProgressProps } from "@interface";

export default function TaxDeductionProgress({
  최대공제한도,
  공제금액,
}: ITaxDeductionProgressProps) {
  const progress = Math.min(Math.round((공제금액 / 최대공제한도) * 100), 100);

  return (
    <>
      <div className="relative pt-10">
        {/* 프로그레스바 */}
        <div className="w-full h-9 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className="h-full bg-brand-blue rounded-lg transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 말풍선 */}
        {progress !== 0 && (
          <div
            className="absolute top-0"
            style={{
              left: `${progress}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-black text-white text-xs px-3 py-2 rounded-lg shadow whitespace-nowrap">
              {progress}%
            </div>
            <div className="w-2 h-2 bg-black rotate-45 mx-auto -mt-1"></div>
          </div>
        )}
      </div>

      {/* 최대 공제 한도 표시 */}
      <div className="flex justify-end mt-2 text-xs text-gray-600">
        최대 공제 한도 {formatKoreanCurrency(최대공제한도)}
      </div>
    </>
  );
}
