export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl p-5 bg-white/90 border border-gray-200 shadow-sm">
      {children}
    </section>
  );
}
