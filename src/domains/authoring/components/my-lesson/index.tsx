import { Button } from "@/shared/components/ui/button";
import { DataTable } from "@/shared/components/ui/table";
import { useGetLessons } from "../../queries";
import { useAuthStore } from "@/domains/auth/storage";

export default function MyLessons() {
  const { id } = useAuthStore();
  const columns = [
    { key: "title", header: "Lesson Title" },
    { key: "author", header: "Author" },
    { key: "category", header: "Category" },
    { key: "status", header: "Status" },
    { key: "createdAt", header: "Created At" },
    { key: "updatedAt", header: "Updated At" },
  ];

  const { data } = useGetLessons({ authorId: id });

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">My Lessons</p>
        <Button>Create new lesson</Button>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
}
