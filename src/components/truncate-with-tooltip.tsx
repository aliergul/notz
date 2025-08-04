"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncateWithTooltipProps {
  text: string;
  maxLength: number;
}

export default function TruncateWithTooltip({
  text,
  maxLength,
}: TruncateWithTooltipProps) {
  if (text.length <= maxLength) {
    return <>{text}</>;
  }

  const truncatedText = text.slice(0, maxLength) + "...";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{truncatedText}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
