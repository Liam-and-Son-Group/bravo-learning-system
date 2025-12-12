import { useState } from "react";
import MyLessons from "../components/my-lesson";
import { FolderSidebar } from "../components/folder-sidebar";

export default function AuthoringPage() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  return (
    <div className="flex bg-background rounded-lg h-full">
      {/* Folder Sidebar */}
      <aside className="w-64 border-r bg-card">
        <FolderSidebar
          selectedFolderId={selectedFolderId}
          onFolderSelect={setSelectedFolderId}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <MyLessons selectedFolderId={selectedFolderId} />
      </main>
    </div>
  );
}
