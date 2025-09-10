interface ICategoryProps {
  title: string;
  tooltipContent?: string;
  center?: boolean;
}

interface IResultProps {
  amount: number | string;
  message: string;
  color?: "text-brand-red" | "text-brand-blue";
}

interface ITaxDeductionProgressProps {
  최대공제한도: number;
  공제금액: number;
}

interface ITaxResultProps {
  차감징수액: number;
  최종결정세액: number;
  최종기납부세액: number | string;
}

export type {
  ICategoryProps,
  IResultProps,
  ITaxDeductionProgressProps,
  ITaxResultProps,
};
