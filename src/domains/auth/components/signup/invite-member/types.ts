export type TRole = {
  id: string;
  name: string;
  permissions: string[];
};

export type TInviteMethod = "email" | "username" | "link";

export type TInviteMemberForm = {
  inviteMethod: TInviteMethod;
  emails: string[];
  usernames: string[];
  role: string;
  message?: string;
  // Share link specific fields
  linkExpiration?: Date;
  maxUses?: number;
};

export type TInviteResponse = {
  success: boolean;
  inviteId?: string;
  inviteLink?: string;
  error?: string;
};

// Constants
export const INVITE_METHODS = [
  { label: "Invite by Email", value: "email" },
  { label: "Invite by Username", value: "username" },
  { label: "Generate Share Link", value: "link" },
] as const;

export const DEFAULT_ROLES = [
  { id: "admin", name: "Administrator", permissions: ["*"] },
  {
    id: "teacher",
    name: "Teacher",
    permissions: ["create:course", "edit:course", "view:analytics"],
  },
  {
    id: "student",
    name: "Student",
    permissions: ["view:course", "submit:assignment"],
  },
] as const;
