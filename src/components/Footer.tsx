import React from "react";

export default function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-4 md:pt-8 pt-4 pb-36 text-xs text-gray-500 flex justify-center items-center">
      © {new Date().getFullYear()} tax-preview — 연말정산 미리보기. 모든 계산은
      참고용입니다.
    </footer>
  );
}
