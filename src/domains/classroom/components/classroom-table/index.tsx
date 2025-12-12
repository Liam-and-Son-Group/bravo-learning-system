import type { Classroom } from "../../types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { DataTable } from "@/shared/components/ui/table";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";

interface Props {
  data: Classroom[];
  onDisable: (id: string) => void;
  onEnable: (id: string) => void;
  onLeave: (id: string) => void;
}

export function ClassroomsTable({ data, onDisable, onEnable, onLeave }: Props) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleNavigate = (id: string) => navigate({ to: `/classrooms/${id}` });

  const columns = [
    {
      key: "name" as const,
      header: "Name",
      render: (value: string, row: Classroom) => (
        <span
          onClick={() => handleNavigate(row.id)}
          className="font-medium cursor-pointer"
        >
          {value}
        </span>
      ),
    },
    {
      key: "organizationName" as const,
      header: "Organization",
      render: (value: string) => <Badge variant="secondary">{value}</Badge>,
    },
    {
      key: "studentsCount" as const,
      header: "Students",
      render: (value: number) => <span className="text-right">{value}</span>,
    },
    {
      key: "createdAt" as const,
      header: "Created",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "status" as const,
      header: "Status",
      render: (value: string) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Active" : "Disabled"}
        </Badge>
      ),
    },
    {
      key: "id" as const,
      header: "",
      render: (_: string, row: Classroom) => (
        <DropdownMenu
          open={openMenuId === row.id}
          onOpenChange={(o) => setOpenMenuId(o ? row.id : null)}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleNavigate(row.id)}>
              View details
            </DropdownMenuItem>
            {row.status === "active" ? (
              <DropdownMenuItem onClick={() => onDisable(row.id)}>
                Disable
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onEnable(row.id)}>
                Enable
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onLeave(row.id)}>
              Leave class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="rounded-md border">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
