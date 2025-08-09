import { NOTIFICATION_ICON } from "@/shared/constants/notification";
import {
  PRIORITY_COLOR_SYSTEM,
  PRIORITY_ICON_SYSTEM,
} from "@/shared/constants/priority-system";
import { cn } from "@/shared/lib/utils/mergeClass";
import type { TNotification } from "@/shared/types/notification.types";
import { useMemo } from "react";

const NOTIFICATION_MOCK_DATA: TNotification[] = [
  {
    id: "4",
    title: "John Doe submitted Homework 3",
    type: "LEARNING",
    priority: "IMPORTANT",
    shortSummary:
      "John Doe has submitted Homework 3 for Algebra II. Please review and provide feedback before Friday.",
  },
  {
    id: "5",
    title: "System Performance Upgrade",
    type: "SYSTEM",
    priority: "LOW",
    shortSummary:
      "We’ve upgraded our servers to improve loading times and reliability across the platform.",
  },
  {
    id: "6",
    title: "Emma Chen replied to your comment",
    type: "SOCIAL",
    priority: "URGENT",
    shortSummary:
      "Emma replied to your comment in the Physics Study Group: 'I totally agree with your approach!'",
  },
  {
    id: "7",
    title: "New Feature: AI-Powered Study Recommendations",
    type: "ADMIN",
    priority: "MEDIUM",
    shortSummary:
      "We’ve launched a new AI feature to help you plan study sessions based on your performance data.",
  },
];

export default function WelcomeNotificationCenter() {
  const renderNotifications = useMemo(
    () =>
      NOTIFICATION_MOCK_DATA.map((item) => (
        <div
          className="p-4 border-[1px] shadow-sm rounded-lg flex gap-4 items-center cursor-pointer"
          key={item.id}
        >
          <div className="w-[50px] h-[50px] flex-shrink-0 bg-blue-400/25 rounded-lg text-blue-700 flex items-center justify-center">
            {NOTIFICATION_ICON[item.type]}
          </div>
          <div className="flex flex-col gap-1 items-start ">
            <div className="flex gap-2 items-center w-full max-w-[666px]">
              <div
                className={cn(
                  PRIORITY_COLOR_SYSTEM[item.priority],
                  "rounded-full font-medium flex gap-1 justify-start items-center max-w-[100px] w-full px-2 py-[1px]"
                )}
              >
                {PRIORITY_ICON_SYSTEM[item.priority]}
                <p className="capitalize text-xs">
                  {item.priority.toString().toLowerCase()}
                </p>
              </div>
              <p className="text-base font-medium text-ellipsis line-clamp-1 w-full">
                {item.title}
              </p>
            </div>
            <p className="text-sm text-slate-600 text-ellipsis line-clamp-1">
              {item.shortSummary}
            </p>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="border-[1px] rounded-xl p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium">
          Drop in for a bit, these notifications are tailored just for you!
        </h2>
        <p className="text-sm text-gray-500">
          These notifications are crafted just for you — to keep you updated on
          system changes, coworker updates, or new student submissions.
        </p>
      </div>
      <div className="border-[1px] w-full my-5" />
      <div className="flex flex-col gap-2">{renderNotifications}</div>
    </div>
  );
}
