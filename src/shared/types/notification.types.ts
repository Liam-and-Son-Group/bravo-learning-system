// Shared types

import type { TPrioritySystem } from "./priority-system.types";

/**
 * Notification types in the LMS system.
 */
const NOTIFICATION_TYPES = {
  /** Notifications related to system events: maintenance, updates, errors, etc. */
  SYSTEM: "SYSTEM",

  /** Notifications related to learning activities: new assignments, deadlines, grades, etc. */
  LEARNING: "LEARNING",

  /** Notifications related to social interactions: messages, comments, group invites, etc. */
  SOCIAL: "SOCIAL",

  /** Notifications related to administrative matters: schedule changes, payments, policies, etc. */
  ADMIN: "ADMIN",
} as const;

export type TNotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export type TNotification = {
  id: string;
  title: string;
  type: TNotificationType;
  priority: TPrioritySystem;
  shortSummary: string;
};
