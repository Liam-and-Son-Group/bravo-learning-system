import type { Classroom } from "../../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils/mergeClass";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  classroom: Classroom;
}

export function SharedClassroomCard({ classroom }: Props) {
  const navigate = useNavigate();
  const handleClick = () =>
    navigate({
      to: "/classrooms/$id",
      params: { id: classroom.id },
      search: {
        scope: "shared",
        q: "",
      },
    });

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={cn(
        "flex items-start gap-4 p-4 hover:shadow-sm transition-shadow cursor-pointer"
      )}
    >
      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden text-xs font-medium">
        {classroom.organizationLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={classroom.organizationLogo}
            alt={classroom.organizationName}
            className="h-full w-full object-cover"
          />
        ) : (
          classroom.organizationName.slice(0, 2).toUpperCase()
        )}
      </div>
      <CardContent className="p-0 flex-1 space-y-1">
        <div className="text-lg font-semibold leading-tight flex items-center gap-2">
          {classroom.name}
          <Badge
            variant={classroom.status === "active" ? "default" : "outline"}
            className="text-[10px] uppercase tracking-wide"
          >
            {classroom.status}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground flex flex-col gap-1 leading-relaxed">
          <span className="font-medium">{classroom.organizationName}</span>
          <span className="font-medium">
            {classroom.studentsCount} members · Created{" "}
            {new Date(classroom.createdAt).toLocaleDateString()} · Status:{" "}
            {classroom.status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
