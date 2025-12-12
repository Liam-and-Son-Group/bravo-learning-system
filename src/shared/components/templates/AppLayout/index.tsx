import LogoSVG from "@/assets/svg/logo";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookAlertIcon,
  ChevronRight,
  GitBranchIcon,
  Menu,
  Search,
  SettingsIcon,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { cn } from "@/shared/lib/utils/mergeClass";
import { SharedTooltip } from "../../ui/tooltip";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import ProtectedNav from "@/shared/components/navigation/ProtectedNav";
import { PROTECTED_NAV_ITEMS } from "@/shared/constants/nav";
import { UserMenu } from "@/shared/components/user-menu";

type TTemplateAction = {
  title: string;
  Icon?: ComponentType<{ className: string }>;
  onClick?: () => void;
  href?: string;
};

// NOTE: Desktop still uses inline nav (legacy structure) for now. Data source unified in PROTECTED_NAV_ITEMS.
const NAVIGATION_ACTIONS: TTemplateAction[] = PROTECTED_NAV_ITEMS.map((i) => ({
  title: i.title,
  href: i.href,
  Icon: i.Icon as ComponentType<{ className: string }>,
}));

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openDrawer, setOpenDrawer] = useState(false);

  const activeRoute = location.pathname;

  const settingActions: TTemplateAction[] = [
    {
      title: "Search",
      Icon: Search,
      onClick: () => {},
    },
    {
      title: "Documentation",
      Icon: BookAlertIcon,
      onClick: () => {},
    },
    {
      title: "Settings",
      Icon: SettingsIcon,
      onClick: () => navigate({ to: "/" }),
    },
  ];

  const renderNavigations = NAVIGATION_ACTIONS.map((item) => (
    <Button
      variant={activeRoute === item.href ? "secondary" : "ghost"}
      className={cn(
        "flex items-center h-[28px] text-sm px-3 text-black",
        activeRoute === item.href &&
          "bg-blue-300/50 text-blue-600 border-blue-600 border"
      )}
      key={item.href}
      onClick={() => navigate({ to: item.href })}
    >
      {item.Icon && <item.Icon className="mr-2 h-4 w-4" />}
      {item.title}
    </Button>
  ));

  const renderSettingActions = settingActions.map((item) => (
    <SharedTooltip key={item.title} label={item.title}>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary w-7 h-7"
        onClick={item.onClick}
      >
        {item.Icon && <item.Icon className="w-4 h-4" />}
      </Button>
    </SharedTooltip>
  ));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="w-full px-3 md:px-5 py-3 text-primary-foreground flex justify-between items-center border-b">
        <div className="flex items-center gap-2 w-full">
          {/* Mobile / Tablet: Hamburger */}
          <div className="md:hidden flex items-center">
            <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5 text-black" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex flex-col gap-4 p-4 w-72"
              >
                <SheetHeader className="items-start text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <LogoSVG className="text-black w-[60px] h-auto" />
                    <span className="font-semibold">Menu</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                  <ProtectedNav onNavigate={() => setOpenDrawer(false)} />
                </nav>
                <div className="pt-2 flex flex-col gap-1 border-t mt-2">
                  <p className="text-xs font-medium text-muted-foreground pt-2 px-1">
                    Quick Actions
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {renderSettingActions}
                  </div>
                </div>
                <div className="mt-auto border-t pt-4">
                  <UserMenu />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* Logo (clickable) */}
          <Button
            variant="ghost"
            type="button"
            aria-label="Go to home"
            onClick={() => navigate({ to: accessToken ? "/" : "/login" })}
            className="p-0 hover:bg-transparent focus-visible:ring-0"
          >
            <LogoSVG className="text-black !w-[70px] !h-auto" />
          </Button>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {renderNavigations}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <SharedTooltip label="You're in Project Name with master branch">
            <div
              className="border-[1px] border-green-600 bg-green-400/30
             text-green-700 rounded-md px-2 flex items-center gap-2 h-[30px]
             min-w-[160px] w-full text-sm cursor-pointer"
            >
              <p className="max-w-[120px] line-clamp-1 text-ellipsis overflow-hidden">
                Project Name
              </p>
              <ChevronRight size={16} />
              <div className="flex items-center gap-1">
                <p className="max-w-[80px] overflow-hidden text-ellipsis line-clamp-1">
                  master
                </p>
                <GitBranchIcon size={16} />
              </div>
            </div>
          </SharedTooltip>
          <div className="hidden md:flex items-center gap-5">
            {renderSettingActions}
          </div>
          {/* User Menu Popover */}
          <UserMenu />
        </div>
      </header>
      <main className="flex-1 px-3 md:px-6 py-1">
        <Card>
          <CardContent className="h-[calc(100vh-90px)] py-0 px-0">
            <Outlet />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
