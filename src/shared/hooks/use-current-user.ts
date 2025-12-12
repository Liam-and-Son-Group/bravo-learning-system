import { useMemo } from "react";
import { useGetUser } from "@/domains/auth/queries";
import { useOrganizationQuery } from "@/domains/organization/queries";
import type { TUserProfileResponse } from "@/domains/auth/types";
import type { Organization } from "@/domains/organization/types";

/**
 * Consolidated user information including personal details, role, and organization
 */
export type CurrentUser = {
  /** User personal information */
  personalInfo: {
    id: string;
    fullname: string;
    email: string;
    jobTitle: string;
    country: string;
    authId: string;
    createdAt: string;
    updatedAt: string;
  };
  /** User role information */
  role: {
    id: string;
    name: string;
  };
  /** Organization the user belongs to (null if not yet assigned) */
  organization: Organization | null;
  /** Organization ID (null if not yet assigned) */
  organizationId: string | null;
};

/**
 * Hook state and utilities
 */
export type UseCurrentUserResult = {
  /** Consolidated current user data */
  currentUser: CurrentUser | null;
  /** Loading state - true when fetching user or organization data */
  isLoading: boolean;
  /** Error state - true if user fetch failed */
  isError: boolean;
  /** Success state - true when all data is loaded */
  isSuccess: boolean;
  /** Refetch user and organization data */
  refetch: () => void;
};

/**
 * Common hook to get current user with personal info, organization, and role.
 *
 * @param options - Configuration options
 * @param options.enabled - Enable/disable the query (default: true)
 *
 * @returns {UseCurrentUserResult} Current user data and query states
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { currentUser, isLoading } = useCurrentUser();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!currentUser) return <div>No user found</div>;
 *
 *   return (
 *     <div>
 *       <h1>{currentUser.personalInfo.fullname}</h1>
 *       <p>Role: {currentUser.role.name}</p>
 *       <p>Organization: {currentUser.organization?.name}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCurrentUser(options?: {
  enabled?: boolean;
}): UseCurrentUserResult {
  const enabled = options?.enabled ?? true;

  // Fetch user profile data
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    isSuccess: isUserSuccess,
    refetch: refetchUser,
  } = useGetUser({ enabled });

  // Extract organizationId from user data
  // NOTE: Assuming backend will add organizationId to TUserProfileResponse
  // If not available yet, this will be null
  const organizationId = useMemo(() => {
    const rawUser = userData?.body as TUserProfileResponse & {
      organization_id?: string;
      organizationId?: string;
    };
    return rawUser?.organizationId || rawUser?.organization_id || null;
  }, [userData]);

  // Fetch organization data if organizationId is available
  const {
    data: organizationData,
    isLoading: isOrgLoading,
    refetch: refetchOrg,
  } = useOrganizationQuery(organizationId || "", {
    enabled: enabled && !!organizationId,
  });

  // Consolidated loading state
  const isLoading = isUserLoading || (!!organizationId && isOrgLoading);

  // Build the consolidated currentUser object
  const currentUser = useMemo((): CurrentUser | null => {
    if (!userData?.body) return null;

    const rawUser = userData.body;

    return {
      personalInfo: {
        id: rawUser.id,
        fullname: rawUser.fullname,
        email: rawUser.email,
        jobTitle: rawUser.jobTitle,
        country: rawUser.country,
        authId: rawUser.authId,
        createdAt: rawUser.createdAt,
        updatedAt: rawUser.updatedAt,
      },
      role: {
        id: rawUser.role.id,
        name: rawUser.role.Name,
      },
      organization: organizationData || null,
      organizationId: organizationId,
    };
  }, [userData, organizationData, organizationId]);

  // Refetch both user and organization
  const refetch = () => {
    refetchUser();
    if (organizationId) {
      refetchOrg();
    }
  };

  return {
    currentUser,
    isLoading,
    isError: isUserError,
    isSuccess: isUserSuccess && (!organizationId || !!organizationData),
    refetch,
  };
}
