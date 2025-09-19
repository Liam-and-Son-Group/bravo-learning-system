import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export type ClassroomScope = "mine" | "organizations";

interface Props {
  value: ClassroomScope;
  onChange: (value: ClassroomScope) => void;
}

export function ClassroomScopeTabs({ value, onChange }: Props) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as ClassroomScope)}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="mine">My classrooms</TabsTrigger>
        <TabsTrigger value="organizations">Organizations</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
