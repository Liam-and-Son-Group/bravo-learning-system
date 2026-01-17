import { useMemo, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { ClassroomsTable } from "../components/classroom-table";
import { CreateClassroomDialog } from "../components/create-classroom-dialog";
import { SharedClassroomCard } from "../components/shared-classroom-card";
import {
  useClassroomsQuery,
  useToggleClassroomStatusMutation,
  useLeaveClassroomMutation,
} from "../queries";
import type { ClassroomListFilters } from "../types";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

type ClassroomScope = "mine" | "organizations" | "shared";
interface ClassroomSearchState {
  scope: ClassroomScope;
  q: string;
}

export default function ClassroomsPage() {
  const search = useSearch({
    from: "/auth/classrooms",
  }) as ClassroomSearchState;
  const navigate = useNavigate();

  // Get current user and organization ID
  const { currentUser } = useCurrentUser();
  const organizationId = currentUser?.organizationId || null;

  const [inputValue, setInputValue] = useState<string>(search.q || "");

  // Keep local inputValue in sync when route changes externally (e.g., back/forward)
  useEffect(() => {
    setInputValue(search.q || "");
  }, [search.q]);

  const filters: ClassroomListFilters = useMemo(
    () => ({
      scope: search.scope,
      search: search.q || "",
      sort: "createdAt",
      order: "desc",
    }),
    [search.scope, search.q]
  );
  const { data: classrooms = [], isLoading } = useClassroomsQuery(
    filters,
    organizationId
  );
  const { mutate: toggleStatus } = useToggleClassroomStatusMutation();
  const { mutate: leave } = useLeaveClassroomMutation();

  const updateSearch = (next: Partial<ClassroomSearchState>) => {
    navigate({
      to: "/classrooms",
      search: (prev): ClassroomSearchState => {
        const current: ClassroomSearchState = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          scope: (prev as any)?.scope ?? "mine",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          q: (prev as any)?.q ?? "",
        };
        return {
          scope: next.scope ?? current.scope,
          q: next.q ?? current.q,
        };
      },
      replace: true,
    });
  };

  const handleScopeChange = (scope: "mine" | "organizations" | "shared") =>
    updateSearch({ scope });
  const debounceMs = 1000; // 1s as requested
  const debouncedUpdate = useRef(
    debounce((value: string) => {
      updateSearch({ q: value });
    }, debounceMs)
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedUpdate.current(value);
  };

  const flushSearch = () => {
    debouncedUpdate.current.flush();
    updateSearch({ q: inputValue });
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    const d = debouncedUpdate.current;
    return () => {
      d.cancel();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <p className="text-2xl font-semibold">Classrooms</p>
            <div className="flex items-center gap-2">
              <Label htmlFor="sharedToggle" className="text-sm font-medium">
                Shared With Me
              </Label>
              <Switch
                id="sharedToggle"
                checked={filters.scope === "shared"}
                onCheckedChange={(checked) =>
                  handleScopeChange(checked ? "shared" : "mine")
                }
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              placeholder="Search classrooms..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full md:w-64"
            />
            <Button variant="outline" onClick={flushSearch}>
              Search
            </Button>
          </div>
        </div>
        {filters.scope !== "shared" && (
          <div className="flex items-end w-full justify-end">
            <CreateClassroomDialog
              organizations={[{ id: "org_1", name: "Bravo Learning Space" }]}
            />
          </div>
        )}
        <div>
          {isLoading ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              Loading classrooms...
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {filters.scope === "shared" ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {classrooms.map((c) => (
                    <SharedClassroomCard key={c.id} classroom={c} />
                  ))}
                  {classrooms.length === 0 && (
                    <div className="col-span-full text-sm text-muted-foreground text-center py-8">
                      No shared classrooms.
                    </div>
                  )}
                </div>
              ) : (
                <ClassroomsTable
                  data={classrooms}
                  onDisable={(id) => toggleStatus({ id, next: "disabled" })}
                  onEnable={(id) => toggleStatus({ id, next: "active" })}
                  onLeave={(id) =>
                    leave({
                      classroomId: id,
                      userId: currentUser?.personalInfo?.id || "",
                      organizationId: organizationId || "",
                    })
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
