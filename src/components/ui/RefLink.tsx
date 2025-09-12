export default function RefLink({ url }: { url: string }) {
  return (
    <a
      className="inline-block text-xs underline text-brand-blue"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      참고 링크
    </a>
  );
}
