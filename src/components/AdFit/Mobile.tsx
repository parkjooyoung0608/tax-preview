import { useEffect } from "react";

export default function AdFitMobile() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    s.async = true;
    document.body.appendChild(s);

    return () => {
      document.body.removeChild(s);
    };
  }, []);

  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit="DAN-VjfgD3Amq2Q9qa7L"
      data-ad-width="320"
      data-ad-height="100"
    />
  );
}
