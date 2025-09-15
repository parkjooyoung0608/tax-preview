import InfoTooltip from "@components/InfoToolTip";
import { ICategoryProps } from "@interface";

export default function Category({
  title,
  tooltipContent,
  center,
}: ICategoryProps) {
  return (
    <div
      className={`flex items-center text-[14px] gap-1 ${
        center ? "justify-center" : ""
      }`}
    >
      <h2>{title}</h2>
      {tooltipContent && (
        <InfoTooltip content={tooltipContent} position="left" />
      )}
    </div>
  );
}
