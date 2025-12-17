import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IconButtonTooltipProps {
  icon: ReactNode;
  tooltip: string;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "icon" | "sm" | "default" | "lg";
}

export function IconButtonTooltip({
  icon,
  tooltip,
  onClick,
  className,
  iconClassName,
  variant = "secondary",
  size = "icon",
}: IconButtonTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          onClick={onClick}
          className={`group size-9 rounded-full ${className ?? ""}`}
        >
          <span className={iconClassName}>{icon}</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
