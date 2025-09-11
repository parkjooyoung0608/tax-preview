import { useEffect } from "react";

export default function useLocalStorageSync<T>(key: string, value: T) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
}
