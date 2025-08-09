import { Button } from "@/shared/components/ui/button";
import { DataTable } from "@/shared/components/ui/table";

export default function AuthoringPage() {
  const columns = [
    { key: "title", header: "Lesson Title" },
    { key: "author", header: "Author" },
    { key: "category", header: "Category" },
    { key: "status", header: "Status" },
    { key: "createdAt", header: "Created At" },
    { key: "updatedAt", header: "Updated At" },
  ];

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">All of your Lessons</p>
        <Button>Create new lesson</Button>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
}
