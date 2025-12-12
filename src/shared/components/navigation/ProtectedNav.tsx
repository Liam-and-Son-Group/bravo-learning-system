// ProtectedNav
// Renders the list of protected navigation links.
// Used in: Desktop header (inline) & Mobile/Tablet drawer (Sheet).
// Data source: PROTECTED_NAV_ITEMS (centralized in shared/constants/nav.ts)
// Pass onNavigate to close parent overlays (like Sheet) after navigation.
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { cn } from "@/shared/lib/utils/mergeClass";
import { PROTECTED_NAV_ITEMS } from "@/shared/constants/nav";

export function ProtectedNav({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeRoute = location.pathname;

  return (
    <div className="flex flex-col md:flex-row gap-1 w-full">
      {PROTECTED_NAV_ITEMS.map((item) => {
        const active = activeRoute === item.href;
        return (
          <Button
            key={item.href}
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "flex items-center justify-start md:justify-center h-9 text-sm md:h-[28px] px-3 md:px-3 rounded-md w-full md:w-auto",
              active && "bg-blue-300/50 text-blue-600 border-blue-600 border"
            )}
            onClick={() => {
              navigate({ to: item.href });
              onNavigate?.();
            }}
          >
            {item.Icon && <item.Icon className="mr-2 h-4 w-4" />}
            {item.title}
          </Button>
        );
      })}
    </div>
  );
}

export default ProtectedNav;
