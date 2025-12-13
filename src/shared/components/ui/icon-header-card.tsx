import type { ReactNode } from "react";
import { Card } from "@/shared/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface IconHeaderCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  bgClass: string;
  iconClass: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const IconHeaderCard = ({
  Icon,
  title,
  description,
  bgClass,
  iconClass,
  actions,
  children,
}: IconHeaderCardProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${bgClass}`}>
              <Icon className={`h-5 w-5 ${iconClass}`} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
        {children}
      </div>
    </Card>
  );
};
