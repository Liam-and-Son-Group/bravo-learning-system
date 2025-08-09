import type { ReactElement } from "react";
import Sidebar, {
  type TSidebarItem,
} from "../../../../shared/components/ui/directory-browser";
import {
  Album,
  BookCheckIcon,
  BookDashed,
  BookLockIcon,
  Bookmark,
  BookPlus,
  Calendar1,
  ClockIcon,
  Folder,
  FolderIcon,
  Tag,
  TagIcon,
  User2Icon,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type TProps = {
  children: ReactElement;
  title?: string;
  actions?: ReactElement;
  searchable?: boolean;
  sortable?: boolean;
};

const SIDE_BAR_ITEMS: TSidebarItem[] = [
  {
    id: "recent",
    label: "Recent",
    Icon: ClockIcon,
  },
  {
    id: "all-category",
    label: "All Category",
    Icon: Bookmark,
  },
  {
    id: "schedule",
    label: "Schedule",
    Icon: Calendar1,
  },

  {
    id: "private-space",
    label: "Private Space",
    Icon: FolderIcon,
    children: [
      {
        id: "created-by-me",
        label: "Created by Me",
        Icon: User2Icon,
      },
      {
        id: "shared-with-me",
        label: "Shared with Me",
        Icon: FolderIcon,
      },
    ],
  },

  {
    id: "browse-folders",
    label: "Browse Folders",
    Icon: FolderIcon,
    children: [
      {
        id: "browse-all",
        label: "All",
        Icon: Folder,
      },
      {
        id: "browse-status",
        label: "Status",
        Icon: TagIcon,
        children: [
          {
            id: "status-published",
            label: "Published",
            Icon: BookCheckIcon,
          },
          {
            id: "status-updated",
            label: "Updated",
            Icon: BookPlus,
          },
          {
            id: "status-draft",
            label: "Draft",
            Icon: BookDashed,
          },
          {
            id: "status-archived",
            label: "Archived",
            Icon: BookLockIcon,
          },
        ],
      },
    ],
  },
  {
    id: "browse-category",
    label: "Category",
    Icon: Album,
    children: [
      {
        id: "default-category",
        label: "Default Category",
        Icon: Tag,
      },
    ],
  },
];

export default function DirectoryBrowserLayout({ children }: TProps) {
  const navigate = useNavigate();

  const onSidebarClick = (id: string) => {
    navigate({
      to: "/authoring",
      search: {
        view: id,
      },
    });
  };

  return (
    <div className="w-full h-full grid grid-cols-6 lg:grid-cols-5">
      <aside className="col-span-2 lg:col-span-1 border-r-[1px] border-gray-200">
        <Sidebar data={SIDE_BAR_ITEMS} onItemSelected={onSidebarClick} />
      </aside>
      <main className="col-span-4 lg:col-span-4 p-4">{children}</main>
    </div>
  );
}
