import { useEffect, useState } from "react";
import AdFitWeb from "@components/AdFit/Web";
import AdFitMobile from "@components/AdFit/Mobile";

export default function ResponsiveAdFit() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <AdFitMobile /> : <AdFitWeb />;
}
