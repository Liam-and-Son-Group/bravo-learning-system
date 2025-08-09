//Storage
export type TStorageUserData = {
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
