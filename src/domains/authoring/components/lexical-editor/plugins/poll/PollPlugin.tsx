import { useState } from "react";
import { Plus, Trash2, BarChart2 } from "lucide-react";
import { IconHeaderCard } from "@/shared/components/ui/icon-header-card";
import type {
  PluginEditorProps,
  PluginPreviewProps,
  PollData,
} from "../../../../types/compose";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
// import { Progress } from "@/shared/components/ui/progress";
import { Card } from "@/shared/components/ui/card";

export const PollEditor = ({ data, onChange }: PluginEditorProps<PollData>) => {
  const addOption = () => {
    const newOption = {
      id: crypto.randomUUID(),
      text: "",
    };
    onChange({
      ...data,
      options: [...(data.options || []), newOption],
    });
  };

  const updateOption = (id: string, text: string) => {
    onChange({
      ...data,
      options: data.options?.map((opt) =>
        opt.id === id ? { ...opt, text } : opt,
      ),
    });
  };

  const removeOption = (id: string) => {
    onChange({
      ...data,
      options: data.options?.filter((opt) => opt.id !== id),
    });
  };

  return (
    <IconHeaderCard
      Icon={BarChart2}
      title="Poll"
      description="Single-question poll for real-time student opinion"
      bgClass="bg-purple-100"
      iconClass="text-purple-600"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Question</Label>
          <Input
            value={data.question || ""}
            onChange={(e) => onChange({ ...data, question: e.target.value })}
            placeholder="e.g., What is your favorite programming language?"
          />
        </div>

        <div className="space-y-2">
          <Label>Options</Label>
          <div className="space-y-2">
            {data.options?.map((option, index) => (
              <div key={option.id} className="flex gap-2">
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(option.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            className="w-full mt-2"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Option
          </Button>
        </div>
      </div>
    </IconHeaderCard>
  );
};

export const PollPreview = ({ data }: PluginPreviewProps<PollData>) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Mock results generation
  const [results] = useState(() => {
    const count = data.options?.length || 0;
    if (count === 0) return {};

    // Generate random percentages that sum to 100
    let remaining = 100;
    const distribution: Record<string, number> = {};

    data.options?.forEach((opt, i) => {
      if (i === count - 1) {
        distribution[opt.id] = remaining;
      } else {
        const val = Math.floor(Math.random() * remaining);
        distribution[opt.id] = val;
        remaining -= val;
      }
    });
    return distribution;
  });

  const handleVote = () => {
    if (selectedOption) {
      setHasVoted(true);
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <h3 className="text-xl font-semibold text-center mb-6">
        {data.question || "Untitled Poll"}
      </h3>

      {!hasVoted ? (
        <Card className="p-6">
          <RadioGroup
            value={selectedOption || ""}
            onValueChange={setSelectedOption}
            className="space-y-4"
          >
            {data.options?.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedOption === option.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer font-normal text-base"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            className="w-full mt-6"
            disabled={!selectedOption}
            onClick={handleVote}
          >
            Vote
          </Button>
        </Card>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {data.options?.map((option) => {
            const percentage = results[option.id] || 0;
            const isSelected = selectedOption === option.id;

            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className={isSelected ? "font-bold text-primary" : ""}>
                    {option.text} {isSelected && "(You)"}
                  </span>
                  <span className="text-muted-foreground">{percentage}%</span>
                </div>
                <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                  <div
                    className="h-full bg-primary flex-1 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6 pt-4 border-t">
            <BarChart2 className="w-4 h-4" />
            <span>Poll Results</span>
          </div>
        </div>
      )}
    </div>
  );
};
