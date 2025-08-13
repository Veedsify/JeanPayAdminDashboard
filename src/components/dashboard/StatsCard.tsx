import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "cyan" | "orange" | "default";
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "md:rounded-2xl rounded-xl p-3 md:p-6 text-white",
        {
          "bg-secondary": variant === "cyan",
          "bg-primary": variant === "orange",
          "bg-gray-800": variant === "default",
        },
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="md:w-14 md:h-14 w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Icon className="md:w-6 md:h-6 w-4 h-4 text-black" />
        </div>
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-2xl font-bold mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}
