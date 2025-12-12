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

// Raw login API response (new backend contract)
export type TRawLoginApiResponse = {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

export type TUserProfileResponse = {
  id: string;
  fullname: string;
  email: string;
  country: string;
  authId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  role: {
    id: string;
    Name: string;
  };
  organizationId: string | null;
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
