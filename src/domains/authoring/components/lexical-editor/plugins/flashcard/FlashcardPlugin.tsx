import { useState } from "react";
import { Repeat, Layers } from "lucide-react";
import { IconHeaderCard } from "@/shared/components/ui/icon-header-card";
import type {
  PluginEditorProps,
  PluginPreviewProps,
  FlashcardData,
} from "../../../../types/compose";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

export const FlashcardEditor = ({
  data,
  onChange,
}: PluginEditorProps<FlashcardData>) => {
  return (
    <IconHeaderCard
      Icon={Layers}
      title="Flashcard"
      description="Create a double-sided flashcard for studying"
      bgClass="bg-amber-100"
      iconClass="text-amber-600"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Front Side</Label>
          <Textarea
            value={data.front || ""}
            onChange={(e) => onChange({ ...data, front: e.target.value })}
            placeholder="Enter text for the front..."
            className="min-h-[150px] resize-none text-lg text-center flex items-center justify-center pt-10"
          />
        </div>
        <div className="space-y-2">
          <Label>Back Side</Label>
          <Textarea
            value={data.back || ""}
            onChange={(e) => onChange({ ...data, back: e.target.value })}
            placeholder="Enter text for the back..."
            className="min-h-[150px] resize-none text-lg text-center flex items-center justify-center pt-10 bg-slate-50"
          />
        </div>
      </div>
    </IconHeaderCard>
  );
};

export const FlashcardPreview = ({
  data,
}: PluginPreviewProps<FlashcardData>) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex justify-center py-8 perspective-1000">
      <div
        className="relative w-[300px] h-[200px] cursor-pointer group perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: "1000px" }}
      >
        <div
          className={`relative w-full h-full transition-all duration-500 ease-in-out transform shadow-xl rounded-xl ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:border-primary/50 transition-colors"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-xl font-medium">{data.front || "Front"}</div>
            <div className="absolute bottom-4 text-xs text-muted-foreground flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
              <Repeat className="w-3 h-3" /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center p-6 text-center transform rotate-y-180"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-xl font-medium">{data.back || "Back"}</div>
            <div className="absolute bottom-4 text-xs text-slate-400 flex items-center gap-1">
              <Repeat className="w-3 h-3" /> Click to flip
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
