import { useState } from "react";
import { ClassroomScopeTabs } from "../components/filters/scope-tabs";
import { ClassroomsTable } from "../components/classroom-table";
import { CreateClassroomDialog } from "../components/create-classroom-dialog";
import {
  useClassroomsQuery,
  useToggleClassroomStatusMutation,
  useLeaveClassroomMutation,
} from "../queries";
import type { ClassroomListFilters } from "../types";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

export default function ClassroomsPage() {
  const [filters, setFilters] = useState<ClassroomListFilters>({
    scope: "mine",
    search: "",
    sort: "createdAt",
    order: "desc",
  });
  const { data: classrooms = [], isLoading } = useClassroomsQuery(filters);
  const { mutate: toggleStatus } = useToggleClassroomStatusMutation();
  const { mutate: leave } = useLeaveClassroomMutation();

  const handleScopeChange = (scope: "mine" | "organizations") =>
    setFilters((f) => ({ ...f, scope }));
  const handleSearch = (value: string) =>
    setFilters((f) => ({ ...f, search: value }));

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-2xl font-semibold">Classrooms</p>
          <div className="flex gap-2 w-full md:w-auto ">
            <Input
              placeholder="Search classrooms..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full md:w-64"
            />
            <Button variant="outline">Search</Button>
          </div>
        </div>
        <div className="flex items-end w-full justify-end">
          <CreateClassroomDialog
            organizations={[{ id: "org_1", name: "Bravo Learning Space" }]}
          />
        </div>
        <div>
          {isLoading ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              Loading classrooms...
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <ClassroomScopeTabs
                value={filters.scope}
                onChange={handleScopeChange}
              />
              <ClassroomsTable
                data={classrooms}
                onDisable={(id) => toggleStatus({ id, next: "disabled" })}
                onEnable={(id) => toggleStatus({ id, next: "active" })}
                onLeave={(id) => leave(id)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
