export default function Tag({ title }: { title: string }) {
  return (
    <span className="w-12 text-center px-2 py-0.5 text-[14px] rounded-full bg-blue-100 text-brand-blue">
      {title}
    </span>
  );
}
