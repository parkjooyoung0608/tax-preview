type T급여세부내역 = {
  연봉: number | undefined;
  비과세: number | undefined;
  국민연금: number | undefined;
  고용보험: number | undefined;
  소득세: number | undefined;
  지방소득세: number | undefined;
};

type T보장성보험 = {
  보장성보험: number | undefined;
  장애인전용보장성보험: number | undefined;
};

type T의료비 = {
  일반: number | undefined;
  취약계층: number | undefined;
  미숙아: number | undefined;
  난임: number | undefined;
  산후조리원: number | undefined;
};

type T교육비 = {
  본인: number | undefined;
  아동_초_중_고등학생: number | undefined;
  대학생: number | undefined;
  장애인: number | undefined;
};

type T카드 = {
  신용카드: number | undefined;
  체크카드_현금영수증: number | undefined;
  대중교통: number | undefined;
  전통시장: number | undefined;
  문화생활: number | undefined;
};

type T기부금 = {
  고향사랑: number | undefined;
  정치: number | undefined;
  지정: number | undefined;
};

interface TComputedDeductionDisplay {
  title: string;
  amount: number;
  limit?: number;
  url?: string;
}

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

interface IInputNumberProps {
  label: string;
  value?: number;
  placeholder: string;
  onChange: (v: number | undefined) => void;
  hint?: string;
}

interface IComputedDeductionDisplay {
  title: string;
  공제금액: number;
  공제한도?: number;
  url?: string;
  tooltipContent?: string;
}

interface IComputedDeductionForm extends IComputedDeductionDisplay {
  children: React.ReactNode;
}

interface ICheckBoxProps {
  id: string;
  checked: boolean;
  label: string;
  tooltipContent: string;
  amount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type {
  T급여세부내역,
  T보장성보험,
  T의료비,
  T교육비,
  T카드,
  T기부금,
  TComputedDeductionDisplay,
  ICategoryProps,
  IResultProps,
  ITaxDeductionProgressProps,
  ITaxResultProps,
  IInputNumberProps,
  IComputedDeductionDisplay,
  IComputedDeductionForm,
  ICheckBoxProps,
};
