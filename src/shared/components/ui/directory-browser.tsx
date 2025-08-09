import { cn } from "@/shared/lib/utils/mergeClass";
import { ChevronDown, ChevronRight } from "lucide-react";
import { type ComponentType } from "react";

export type TSidebarItem = {
  id: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  children?: TSidebarItem[];
};

type TProps = {
  data: TSidebarItem[];
  onItemSelected: (id: string) => void;
};

import { useState } from "react";

export default function Sidebar({ data, onItemSelected }: TProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItems = (items: TSidebarItem[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openItems[item.id];

      return (
        <div
          key={item.id}
          className={cn(
            "relative flex flex-col",
            level > 0 && "border-l-[1px]"
          )}
        >
          {level > 0 && <div className="border-t-[1px] absolute top-3 w-3" />}
          <button
            onClick={() => {
              if (hasChildren) {
                toggleItem(item.id);
              } else {
                onItemSelected(item.id);
              }
            }}
            className={`flex items-center text-sm gap-1 justify-start p-1 rounded hover:bg-gray-100 ${
              level > 0 ? "pl-4" : ""
            }`}
          >
            <item.Icon className="h-4 w-4" />
            {item.label}
            {hasChildren && (
              <div className="ml-auto flex items-center gap-1">
                <span className="flex justify-center items-center text-xs p-[2px] rounded-full w-[20px] h-[20px] bg-slate-200">
                  {item.children?.length}
                </span>
                <span className="text-xs">
                  {isOpen ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                </span>
              </div>
            )}
          </button>

          {hasChildren && isOpen && (
            <div className="ml-4">{renderItems(item.children!, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return <div className="flex flex-col gap-2 p-4">{renderItems(data)}</div>;
}
