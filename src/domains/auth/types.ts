//Storage
export type TStorageUserData = {
  id: string;
  fullname: string;
  email: string;
  jobTitle: string;
  country: string;
  accessToken: string;
  refreshToken: string;
  username: string;
};

export type TTemplateResponse<T> = {
  message: string;
  body: T;
};

export type TLoginResponse = {
  access_token: string;
  refresh_token?: string;
};

export type TUserProfileResponse = {
  id: string;
  fullname: string;
  email: string;
  job_title: string;
  country: string;
  role_id: string;
  role: {
    ID: string;
    Name: string;
  };
  auth_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};

export type TCheckToken = {
  verify: string;
};

// ---------------------------------------------
// Signup (multi-step wizard) composite payload
// ---------------------------------------------
export type TSignupCreateAccount = {
  avatarUrl?: string; // URL after upload (optional)
  fullname: string;
  job: string;
  email: string;
  password: string;
  confirm: string; // kept for parity; backend may ignore
  country: string;
  phone?: string;
  timezone: string;
};

export type TSignupOrganization = {
  organizationName: string;
  organizationType: string;
  address?: string;
  city: string;
  country: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  taxCode?: string;
};

export type TSignupInviteMember = {
  inviteMethod: "email" | "username" | "link";
  emails: string[];
  usernames: string[];
  role: string; // role id or code
  message?: string;
};

export type TSignupFullRequest = {
  createAccount: TSignupCreateAccount;
  organization: TSignupOrganization;
  inviteMember: TSignupInviteMember;
};

export type TSignupFullResponse = {
  userId: string;
  organizationId: string;
  invitesProcessed: number;
  access_token?: string; // optionally returned directly
  refresh_token?: string;
};

// Uploads
export type TUploadAvatarResponse = {
  url: string; // public URL of stored avatar
  key?: string; // storage key (optional)
};
