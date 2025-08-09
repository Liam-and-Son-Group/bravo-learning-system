import LogoSVG from "@/assets/svg/logo";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  AppWindow,
  BookAlertIcon,
  BookType,
  CheckCircle,
  ChevronRight,
  GitBranchIcon,
  RocketIcon,
  Search,
  SettingsIcon,
  ToyBrick,
  UsersRound,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { cn } from "@/shared/lib/utils/mergeClass";
import { SharedTooltip } from "../../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Card, CardContent } from "../../ui/card";

type TTemplateAction = {
  title: string;
  Icon?: ComponentType<{ className: string }>;
  onClick?: () => void;
  href?: string;
};

const NAVIGATION_ACTIONS: TTemplateAction[] = [
  {
    title: "Dashboard",
    Icon: AppWindow,
    href: "/",
  },
  {
    title: "Class",
    Icon: UsersRound,
    href: "/classes",
  },
  {
    title: "Authoring",
    Icon: BookType,
    href: "/authoring",
  },
  {
    title: "Assignment",
    Icon: CheckCircle,
    href: "/classes",
  },
  {
    title: "Modules",
    Icon: ToyBrick,
    href: "/classes",
  },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeRoute = location.pathname;
  const [_, setOpenSearchDialog] = useState<boolean>(false);

  const settingActions: TTemplateAction[] = [
    {
      title: "Search",
      Icon: Search,
      onClick: () => setOpenSearchDialog(true),
    },
    {
      title: "Documentation",
      Icon: BookAlertIcon,
      onClick: () => setOpenSearchDialog(true),
    },
    {
      title: "Settings",
      Icon: SettingsIcon,
      onClick: () => navigate({ to: "/" }),
    },
  ];

  const renderNavigations = NAVIGATION_ACTIONS.map((item, idx) => (
    <button
      className={cn(
        "flex items-center justify-center h-[28px] text-sm px-3 rounded-lg",
        activeRoute === item.href &&
          "bg-blue-300/50 text-blue-600 border-blue-600 border-[1px]"
      )}
      key={idx}
      onClick={() => navigate({ to: item.href })}
    >
      {item.Icon && <item.Icon className="mr-2 h-4 w-4" />}
      {item.title}
    </button>
  ));

  const renderSettingActions = settingActions.map((item, idx) => (
    <SharedTooltip key={idx} label={item.title}>
      <button className="text-primary">
        {item.Icon && <item.Icon className="w-4 h-4" />}
      </button>
    </SharedTooltip>
  ));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="w-full px-5 py-3 text-primary-foreground flex justify-between items-center">
        <div className="relative flex h-[28px] items-center gap-2 text-black">
          <LogoSVG className="text-black w-[70px] left-4 h-auto absolute" />
          <div className="flex items-center pl-[120px] gap-1">
            {renderNavigations}
          </div>
        </div>
        <div className="flex items-center justify-between gap-5">
          <SharedTooltip label="You're in Project Name with master branch">
            <div
              className="border-[1px] border-green-600 bg-green-400/30
             text-green-700 rounded-md px-2 flex items-center gap-2 h-[30px] 
             min-w-[200px] w-full text-sm cursor-pointer"
            >
              <p className="max-w-[150px] line-clamp-1 text-ellipsis overflow-hidden">
                Project Name
              </p>
              <ChevronRight size={16} />
              <div className="flex items-center gap-1">
                <p className="max-w-[100px] overflow-hidden text-ellipsis line-clamp-1">
                  master
                </p>
                <GitBranchIcon size={16} />
              </div>
            </div>
          </SharedTooltip>
          <div className="flex items-center justify-between gap-5">
            {renderSettingActions}
          </div>
          <SharedTooltip label="Profile settings">
            <Avatar className="w-7 h-7">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/66240966?v=4"
                alt="@avatar"
              />
              <AvatarFallback>LN</AvatarFallback>
            </Avatar>
          </SharedTooltip>
        </div>
      </header>
      <main className="flex-1 px-6 py-1">
        <Card>
          <CardContent className="h-[calc(100vh-90px)] py-0 px-0">
            <Outlet />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
