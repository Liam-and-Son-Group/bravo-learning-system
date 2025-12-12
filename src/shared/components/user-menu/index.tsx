import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { User, Palette, ShoppingBag, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/domains/auth/storage";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { logoutApi } from "@/domains/auth/apis";
import { logout as axiosLogout } from "@/shared/lib/axios";
import { useState } from "react";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const navigate = useNavigate();
  const { logout: clearAuthState } = useAuthStore();
  const { currentUser } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // 1. Call backend to revoke refresh token
      await logoutApi();

      // 2. Clear auth state in Zustand store
      clearAuthState();

      // 3. Clear tokens from localStorage and redirect
      // This also dispatches 'auth:logout' event for other components
      axiosLogout("User logged out");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if API call fails, we still clear local state
      clearAuthState();
      axiosLogout("User logged out (with errors)");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    {
      label: "Account",
      icon: User,
      onClick: () => navigate({ to: "/account" }),
      description: "Manage your account settings",
    },
    {
      label: "Appearance",
      icon: Palette,
      onClick: () => navigate({ to: "/appearance" }),
      description: "Customize your interface",
    },
    {
      label: "Purchase",
      icon: ShoppingBag,
      onClick: () => navigate({ to: "/purchase" }),
      description: "View purchase history",
    },
  ];

  const userInitials =
    currentUser?.personalInfo?.fullname
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const userEmail = currentUser?.personalInfo?.email || "user@example.com";
  const userName = currentUser?.personalInfo?.fullname || "User";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`p-0 h-auto rounded-full hover:opacity-80 transition-opacity ${className}`}
        >
          <Avatar className="w-7 h-7 cursor-pointer">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/66240966?v=4"
              alt={userName}
            />
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        {/* User Info Section */}
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/66240966?v=4"
                alt={userName}
              />
              <AvatarFallback className="text-sm font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
              {currentUser?.organization && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {currentUser.organization.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 h-auto rounded-none hover:bg-accent"
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3 flex-1">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col items-start flex-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          ))}
        </div>

        <Separator />

        {/* Logout Section */}
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm font-medium">
              {isLoggingOut ? "Logging out..." : "Log out"}
            </span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
