import React from "react";

export default function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-4 py-8 text-xs text-gray-500">
      © {new Date().getFullYear()} tax-preview — 연말정산 미리보기. 모든 계산은
      참고용입니다.
    </footer>
  );
}
