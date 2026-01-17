import { Button } from "@/shared/components/ui/button";
import type {
  PluginConfig,
  PluginType,
} from "@/app/domains/authoring/types/compose";

interface ComposeSidebarProps {
  pluginConfigs: PluginConfig[];
  onAddBlock: (pluginId: PluginType) => void;
}

export const ComposeSidebar = ({
  pluginConfigs,
  onAddBlock,
}: ComposeSidebarProps) => {
  return (
    <aside className="w-64 border-r bg-card overflow-y-auto">
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold mb-2 text-sm">Add Content Module</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Click to add a module to your lesson
          </p>
        </div>
        <div className="space-y-2">
          {pluginConfigs.map((config) => (
            <Button
              key={config.id}
              variant="outline"
              onClick={() => onAddBlock(config.id)}
              className="w-full justify-start"
            >
              <config.icon className="h-4 w-4 mr-2" />
              {config.name}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
};
