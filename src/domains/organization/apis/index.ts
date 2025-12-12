import { authInstance } from "@/shared/lib/axios";
import type { Organization } from "../types";

export async function fetchOrganization(id: string): Promise<Organization> {
  const { data } = await authInstance.get(`organizations/${id}`);
  return data as Organization;
}
