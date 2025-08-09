import { BookOpenText, Cog, Megaphone, MessagesSquare } from "lucide-react";
import type { TNotificationType } from "../types/notification.types";
import type { ReactElement } from "react";

export const NOTIFICATION_ICON: Record<TNotificationType, ReactElement> = {
  ADMIN: <Megaphone size={25} />,
  LEARNING: <BookOpenText size={25} />,
  SOCIAL: <MessagesSquare size={25} />,
  SYSTEM: <Cog size={25} />,
};
