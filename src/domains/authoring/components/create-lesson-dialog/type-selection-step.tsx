import { cn } from "@/shared/lib/utils/mergeClass";
import { LESSON_TYPES, type LessonType } from "../../types/lesson-creation";
import {
  ClipboardCheck,
  BookOpen,
  Puzzle,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface TypeSelectionStepProps {
  selectedType: LessonType | null;
  onSelect: (type: LessonType) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  ClipboardCheck,
  BookOpen,
  Puzzle,
  Gamepad2,
};

const COLOR_CLASSES: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  blue: {
    bg: "bg-blue-50 hover:bg-blue-100",
    border: "border-blue-200 hover:border-blue-400",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-green-50 hover:bg-green-100",
    border: "border-green-200 hover:border-green-400",
    text: "text-green-600",
  },
  purple: {
    bg: "bg-purple-50 hover:bg-purple-100",
    border: "border-purple-200 hover:border-purple-400",
    text: "text-purple-600",
  },
  orange: {
    bg: "bg-orange-50 hover:bg-orange-100",
    border: "border-orange-200 hover:border-orange-400",
    text: "text-orange-600",
  },
};

export function TypeSelectionStep({
  selectedType,
  onSelect,
}: TypeSelectionStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Lesson Type</h3>
        <p className="text-sm text-muted-foreground">
          Select the type of content you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LESSON_TYPES.map((lessonType) => {
          const Icon = ICON_MAP[lessonType.icon];
          const colors = COLOR_CLASSES[lessonType.color];
          const isSelected = selectedType === lessonType.id;

          return (
            <Card
              key={lessonType.id}
              className={cn(
                "cursor-pointer transition-all duration-200 border-2",
                colors.bg,
                colors.border,
                isSelected && "ring-2 ring-offset-2 ring-primary"
              )}
              onClick={() => onSelect(lessonType.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg bg-white shadow-sm",
                      colors.text
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1">
                      {lessonType.name}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {lessonType.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
