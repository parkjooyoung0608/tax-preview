export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl p-5 bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-sm">
      {children}
    </section>
  );
}
