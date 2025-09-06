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
