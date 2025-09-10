import { useState, useEffect } from "react";
import { 초기급여세부내역 } from "constants/initialValues";
import { T급여세부내역 } from "@interface";

export default function useSalaryDetail() {
  const [급여세부내역, set급여세부내역] =
    useState<T급여세부내역>(초기급여세부내역);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("급여세부내역");
      if (saved) {
        set급여세부내역(JSON.parse(saved));
      }
    }
  }, []);

  const handle급여세부내역 = (
    key: keyof T급여세부내역,
    value: number | undefined
  ) => {
    set급여세부내역((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("급여세부내역", JSON.stringify(급여세부내역));
    }
  }, [급여세부내역]);

  return { 급여세부내역, set급여세부내역, handle급여세부내역 };
}
