import {
  AppWindow,
  UsersRound,
  BookType,
  CheckCircle,
  ToyBrick,
} from "lucide-react";
import type { ComponentType } from "react";

export type ProtectedNavItem = {
  title: string;
  href: string;
  Icon?: ComponentType<{ className?: string }>;
};

export const PROTECTED_NAV_ITEMS: ProtectedNavItem[] = [
  { title: "Dashboard", href: "/", Icon: AppWindow },
  { title: "Class", href: "/classrooms", Icon: UsersRound },
  { title: "Authoring", href: "/authoring", Icon: BookType },
  { title: "Assignment", href: "/assignments", Icon: CheckCircle },
  { title: "Modules", href: "/modules", Icon: ToyBrick },
];
