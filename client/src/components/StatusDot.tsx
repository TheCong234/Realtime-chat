import { UserStatus } from "@/constants/enum";
import { cn } from "@/lib/utils";

interface IStatusDotProps {
  status?: UserStatus;
  size?: "sm" | "md" | "lg";
  showPulse?: boolean;
  className?: string;
}

const statusConfig = {
  [UserStatus.Online]: {
    color: "bg-green-500",
    label: "Online",
  },
  [UserStatus.Offline]: {
    color: "bg-gray-400",
    label: "Offline",
  },
  [UserStatus.Away]: {
    color: "bg-yellow-500",
    label: "Away",
  },
};

const sizeConfig = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

const StatusDot = ({ status = UserStatus.Offline, size = "sm", showPulse = true, className }: IStatusDotProps) => {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];
  const shouldAnimate = showPulse && status === UserStatus.Online;

  return (
    <span className={cn("relative inline-flex", sizeClass, className)} role="status" aria-label={config.label}>
      <span className={cn("absolute inline-flex h-full w-full rounded-full", config.color)} />
      {shouldAnimate && (
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", config.color)} />
      )}
    </span>
  );
};

export default StatusDot;
