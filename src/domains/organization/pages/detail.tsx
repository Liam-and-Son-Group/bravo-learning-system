import { useParams } from "@tanstack/react-router";
import { useOrganizationQuery } from "../queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

function formatDate(iso?: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function OrganizationDetailPage() {
  const { id } = useParams({ from: "/auth/organizations/$id" });
  const { data: org, isLoading } = useOrganizationQuery(id);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading organization...
      </div>
    );
  }
  if (!org) {
    return (
      <div className="text-sm text-muted-foreground">
        Organization not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={String(org.logoUrl || "")} alt={org.name} />
                <AvatarFallback>
                  {org.name?.slice(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {org.name}
                  <Badge variant="secondary">{org.organizationType}</Badge>
                </CardTitle>
                <CardDescription>
                  {org.slogan || "No slogan provided."}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div>
            <span className="font-medium">Address:</span> {org.address || "-"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-medium">City:</span> {org.city || "-"}
            </div>
            <div>
              <span className="font-medium">Country:</span> {org.country || "-"}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Phone:</span>{" "}
              {org.phoneNumber || "-"}
            </div>
            <div>
              <span className="font-medium">Email:</span>{" "}
              {org.contactEmail || "-"}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Website:</span>{" "}
              {org.websiteUrl ? (
                <a
                  className="text-primary hover:underline"
                  href={String(org.websiteUrl)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {String(org.websiteUrl)}
                </a>
              ) : (
                "-"
              )}
            </div>
            <div>
              <span className="font-medium">Working License:</span>{" "}
              {org.workingLicense || "-"}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Chairman:</span>{" "}
              {org.chairmanName || "-"}
            </div>
            <div>
              <span className="font-medium">Chairman ID:</span>{" "}
              {org.chairmanIdentification || "-"}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Region:</span> {org.region || "-"}
            </div>
            <div>
              <span className="font-medium">Tax Code:</span>{" "}
              {org.taxCode || "-"}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {formatDate(org.createdAt)}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{" "}
              {formatDate(org.updatedAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Users and their roles within this organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {org.users?.length ? (
                  org.users.map((u) => (
                    <TableRow key={u.userId}>
                      <TableCell className="font-mono text-xs md:text-sm">
                        {u.userId}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <Badge key={r} variant="outline">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center text-sm py-8 text-muted-foreground"
                    >
                      No members.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
