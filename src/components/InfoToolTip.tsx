import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

export default function InfoTooltip({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={infoRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center text-gray-500 hover:text-gray-700"
      >
        <Info size={16} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 left-0 bg-black text-white text-xs rounded-lg shadow-lg px-3 py-2 whitespace-pre-line break-words w-[400px]">
          {content}
          <div className="w-2 h-2 bg-black rotate-45 absolute -top-1 left-2"></div>
        </div>
      )}
    </div>
  );
}
