import {
  useClassroomQuery,
  useClassroomStudentsQuery,
  useToggleClassroomStatusMutation,
} from "../queries";
import { useParams } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

export default function ClassroomDetailPage() {
  const { id } = useParams({ from: "/auth/classrooms/$id" });
  const { data: classroom } = useClassroomQuery(id);
  const { data: students = [] } = useClassroomStudentsQuery(id);
  const { mutate: toggleStatus } = useToggleClassroomStatusMutation();

  if (!classroom)
    return (
      <div className="text-sm text-muted-foreground">Loading classroom...</div>
    );

  const isActive = classroom.status === "active";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                {classroom.name}
                <Badge variant={isActive ? "default" : "outline"}>
                  {isActive ? "Active" : "Disabled"}
                </Badge>
              </CardTitle>
              <CardDescription>
                {classroom.description || "No description provided."}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toggleStatus({
                    id: classroom.id,
                    next: isActive ? "disabled" : "active",
                  })
                }
              >
                {isActive ? "Disable" : "Enable"}
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  navigator.clipboard.writeText(classroom.enrollmentKey)
                }
              >
                Copy Enrollment Key
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm grid gap-2">
          <div>
            <span className="font-medium">Organization:</span>{" "}
            {classroom.organizationName}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(classroom.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Students:</span>{" "}
            {classroom.studentsCount}
          </div>
          <div>
            <span className="font-medium">Enrollment Key:</span>{" "}
            {classroom.enrollmentKey}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.role}</TableCell>
                    <TableCell>
                      {new Date(s.joinedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm py-8 text-muted-foreground"
                    >
                      No students enrolled.
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
