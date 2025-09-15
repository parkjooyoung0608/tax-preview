import { useEffect } from "react";

export default function AdFitWeb() {
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
      data-ad-unit="DAN-0IhvBOqp2ozdV4lN"
      data-ad-width="728"
      data-ad-height="90"
    />
  );
}
