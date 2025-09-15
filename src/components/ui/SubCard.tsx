export default function SubCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-6 md:p-6 p-3 border rounded-lg bg-gray-50">
      {children}
    </div>
  );
}
