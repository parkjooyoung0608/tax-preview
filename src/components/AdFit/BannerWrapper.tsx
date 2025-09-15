import { useState } from "react";
import ResponsiveAdFit from "@components/AdFit";

export default function BannerWrapper() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-0 right-0 bg-gray-300 text-white w-4 h-4 flex items-center justify-center text-xs hover:bg-gray-400 z-20"
      >
        ✕
      </button>

      <ResponsiveAdFit />
    </div>
  );
}
