import Tag from "@components/Tag";
import ComputedDeductionDisplay from "@components/computedDeduction/Display";
import { TComputedDeductionDisplay } from "@interface";

/**
 *
 * 고정 공제 항목들을 태그와 함께 리스트 형태로 표시합니다.
 * 각 항목은 `ComputedDeductionDisplay` 컴포넌트를 사용하여
 * 제목, 공제 금액, 공제 한도, 관련 링크를 렌더링합니다.
 *
 * @example
 * ```tsx
 * const items = [
 *   { title: "기본공제", amount: 1500000, limit: 1500000, url: "/deduction/basic" },
 *   { title: "연금보험료 공제", amount: 1200000, limit: 1800000, url: "/deduction/pension" },
 * ];
 *
 * <ComputedDeductionFix items={items} />
 * ```
 *
 * @param {TComputedDeductionDisplay[]} props.items - 표시할 고정 공제 항목 배열
 */
export default function ComputedDeductionFix({
  items,
}: {
  items: TComputedDeductionDisplay[];
}) {
  return (
    <section className="grid grid-cols-1 gap-6">
      <Tag title="고정" />
      {items.map((item) => (
        <ComputedDeductionDisplay
          key={item.title}
          title={item.title}
          공제금액={item.amount}
          공제한도={item.limit}
          url={item.url}
        />
      ))}
    </section>
  );
}
