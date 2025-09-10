import { useState, useEffect } from "react";
import { 초기급여세부내역 } from "constants/initialValues";
import { T급여세부내역 } from "@interface";

export default function useSalaryDetail() {
  const [급여세부내역, set급여세부내역] = useState<T급여세부내역>(() => {
    const saved = localStorage.getItem("급여세부내역");
    return saved ? JSON.parse(saved) : 초기급여세부내역;
  });

  const handle급여세부내역 = (
    key: keyof T급여세부내역,
    value: number | undefined
  ) => {
    set급여세부내역((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    localStorage.setItem("급여세부내역", JSON.stringify(급여세부내역));
  }, [급여세부내역]);

  return { 급여세부내역, set급여세부내역, handle급여세부내역 };
}
