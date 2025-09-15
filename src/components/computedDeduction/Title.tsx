import InfoTooltip from "@components/InfoToolTip";

export default function Title({
  title,
  tooltipContent,
}: {
  title: string;
  tooltipContent?: string;
}) {
  return (
    <div className="flex justify-items-start">
      <div className="flex items-center justify-center gap-1">
        <h3 className="md:text-base text-sm">{title}</h3>
        {tooltipContent && <InfoTooltip content={tooltipContent} />}
      </div>
    </div>
  );
}
