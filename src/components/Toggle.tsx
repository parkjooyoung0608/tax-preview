import React from "react";

export default function Toggle({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-left text-sm font-medium hover:bg-gray-50"
      >
        <span
          className={`mr-1 inline-block transform transition-transform duration-300 ${
            open ? "rotate-90" : "rotate-0"
          }`}
        >
          ▶
        </span>
        {title}
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>
      )}
    </div>
  );
}
