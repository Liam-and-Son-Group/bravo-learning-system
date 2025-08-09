import type { ReactElement } from "react";
import type { TPrioritySystem } from "../types/priority-system.types";
import { ChevronDown, ChevronsUp, ChevronUp, Minus } from "lucide-react";

export const PRIORITY_ICON_SYSTEM: Record<TPrioritySystem, ReactElement> = {
  LOW: <ChevronDown size={16} />,
  MEDIUM: <Minus size={16} />,
  IMPORTANT: <ChevronUp size={16} />,
  URGENT: <ChevronsUp size={16} />,
};

export const PRIORITY_COLOR_SYSTEM: Record<TPrioritySystem, string> = {
  LOW: "bg-green-50 text-green-700 border border-green-700",
  MEDIUM: "bg-yellow-50 text-yellow-700 border border-yellow-700",
  IMPORTANT: "bg-orange-50 text-orange-700 border border-orange-700",
  URGENT: "bg-red-50 text-red-700 border border-red-700",
};
