import InfoTooltip from "@components/InfoToolTip";
import { ITitleProps } from "@interface";

export default function Title({
  title,
  tooltipContent,
  tooltipPosition,
}: ITitleProps) {
  return (
    <div className="flex justify-items-start">
      <div className="flex items-center justify-center gap-1">
        <h3 className="md:text-base text-sm">{title}</h3>
        {tooltipContent && tooltipPosition && (
          <InfoTooltip content={tooltipContent} position={tooltipPosition} />
        )}
      </div>
    </div>
  );
}
