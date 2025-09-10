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

export type { ICategoryProps, IResultProps };
