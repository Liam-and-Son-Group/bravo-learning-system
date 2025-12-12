import { useQuery } from "@tanstack/react-query";
import { fetchOrganization } from "../apis";

export const ORGANIZATION_QUERY_KEYS = {
  detail: (id: string) => ["organization", id] as const,
};

export function useOrganizationQuery(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.detail(id),
    queryFn: () => fetchOrganization(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  });
}
