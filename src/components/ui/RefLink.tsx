export default function RefLink({ url }: { url: string }) {
  return (
    <a
      className="inline-block text-xs underline text-emerald-600 dark:text-emerald-400"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      참고 링크
    </a>
  );
}
