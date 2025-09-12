import { useEffect } from "react";
import type { AppProps } from "next/app";
import "@styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // F12 또는 Ctrl+Shift+I 막기
      const keyHandler = (e: KeyboardEvent) => {
        if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
          e.preventDefault();
          alert("개발자 도구는 사용할 수 없습니다.");
        }
      };

      const contextMenuHandler = (e: MouseEvent) => e.preventDefault();

      document.addEventListener("keydown", keyHandler);
      document.addEventListener("contextmenu", contextMenuHandler);

      return () => {
        document.removeEventListener("keydown", keyHandler);
        document.removeEventListener("contextmenu", contextMenuHandler);
      };
    }
  }, []);

  return <Component {...pageProps} />;
}
