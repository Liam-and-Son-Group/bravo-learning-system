import type { Classroom } from "../../types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead className="text-right">Students</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cls) => (
            <TableRow key={cls.id} className="cursor-pointer hover:bg-muted/40">
              <TableCell
                onClick={() => handleNavigate(cls.id)}
                className="font-medium"
              >
                {cls.name}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{cls.organizationName}</Badge>
              </TableCell>
              <TableCell className="text-right">{cls.studentsCount}</TableCell>
              <TableCell>
                {new Date(cls.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={cls.status === "active" ? "default" : "outline"}
                >
                  {cls.status === "active" ? "Active" : "Disabled"}
                </Badge>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu
                  open={openMenuId === cls.id}
                  onOpenChange={(o) => setOpenMenuId(o ? cls.id : null)}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleNavigate(cls.id)}>
                      View details
                    </DropdownMenuItem>
                    {cls.status === "active" ? (
                      <DropdownMenuItem onClick={() => onDisable(cls.id)}>
                        Disable
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onEnable(cls.id)}>
                        Enable
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onLeave(cls.id)}>
                      Leave class
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-sm py-8 text-muted-foreground"
              >
                No classrooms found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
