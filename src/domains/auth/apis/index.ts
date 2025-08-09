import { nonAuthInstance } from "@/shared/lib/axios";

export const login = async (data: { username: string; password: string }) => {
  const response = await nonAuthInstance.post("/auth/login", data);
  return response.data;
};

export const signup = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await nonAuthInstance.post("/auth/signup", data);
  return response.data;
};
