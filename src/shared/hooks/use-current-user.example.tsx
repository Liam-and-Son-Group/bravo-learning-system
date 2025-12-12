import { useCurrentUser } from "@/shared/hooks/use-current-user";

/**
 * Example: Display current user information in a component
 */
export default function UserProfileExample() {
  const { currentUser, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading user...</div>;
  }

  if (isError || !currentUser) {
    return <div className="text-sm text-destructive">Failed to load user</div>;
  }

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <div>
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <p>Name: {currentUser.personalInfo.fullname}</p>
        <p>Email: {currentUser.personalInfo.email}</p>
        <p>Job Title: {currentUser.personalInfo.jobTitle}</p>
        <p>Country: {currentUser.personalInfo.country}</p>
      </div>

      {/* Role */}
      <div>
        <h2 className="text-lg font-semibold">Role</h2>
        <p>Role: {currentUser.role.name}</p>
        <p>Role ID: {currentUser.role.id}</p>
      </div>

      {/* Organization */}
      <div>
        <h2 className="text-lg font-semibold">Organization</h2>
        {currentUser.organization ? (
          <>
            <p>Name: {currentUser.organization.name}</p>
            <p>Type: {currentUser.organization.organizationType}</p>
            <p>City: {currentUser.organization.city}</p>
            <p>Country: {currentUser.organization.country}</p>
            <p>Email: {currentUser.organization.contactEmail}</p>
          </>
        ) : (
          <p className="text-muted-foreground">No organization assigned</p>
        )}
      </div>
    </div>
  );
}
