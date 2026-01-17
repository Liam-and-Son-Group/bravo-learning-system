import { Code, Play, Terminal } from "lucide-react";
import { IconHeaderCard } from "@/shared/components/ui/icon-header-card";
import { useState, useRef, useEffect } from "react";
import type {
  PluginEditorProps,
  PluginPreviewProps,
  CodeBlockData,
} from "../../../../types/compose";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
];

export const CodeBlockEditor = ({
  data,
  onChange,
}: PluginEditorProps<CodeBlockData>) => {
  return (
    <IconHeaderCard
      Icon={Code}
      title="Code Block"
      description="Interactive code editor with runtime execution"
      bgClass="bg-blue-100"
      iconClass="text-blue-600"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Label>Language</Label>
            <Select
              value={data.language || "javascript"}
              onValueChange={(value) => onChange({ ...data, language: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Code</Label>
          <Textarea
            value={data.code || ""}
            onChange={(e) => onChange({ ...data, code: e.target.value })}
            placeholder="// Enter your code here..."
            className="font-mono min-h-[200px]"
          />
        </div>
      </div>
    </IconHeaderCard>
  );
};

export const CodeBlockPreview = ({
  data,
}: PluginPreviewProps<CodeBlockData>) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("code");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    if (!iframeRef.current) return;

    setLogs([]);
    setActiveTab("run");

    const code = data.code || "";
    const language = data.language || "javascript";

    let content = "";

    if (language === "html") {
      content = code;
    } else if (language === "javascript" || language === "typescript") {
      // Basic JS sandbox with console capture
      content = `
        <!DOCTYPE html>
        <html>
          <body>
            <script>
              const originalLog = console.log;
              const originalError = console.error;
              const originalWarn = console.warn;
              
              function sendLog(type, args) {
                window.parent.postMessage({
                  type: 'console',
                  level: type,
                  message: Array.from(args).join(' ')
                }, '*');
              }

              console.log = (...args) => sendLog('info', args);
              console.error = (...args) => sendLog('error', args);
              console.warn = (...args) => sendLog('warn', args);

              window.onerror = function(msg, url, line) {
                sendLog('error', [msg]);
                return false;
              };

              try {
                ${code}
              } catch (e) {
                console.error(e);
              }
            </script>
          </body>
        </html>
      `;
    } else {
      content = `
        <!DOCTYPE html>
        <html>
          <body style="font-family: monospace; padding: 1rem;">
            Language '${language}' runtime not supported in browser sandbox yet.
          </body>
        </html>
      `;
    }

    const iframe = iframeRef.current;
    iframe.srcdoc = content;
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "console") {
        setLogs((prev) => [
          ...prev,
          `[${event.data.level}] ${event.data.message}`,
        ]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-2">
        <Button size="sm" onClick={runCode} className="gap-2">
          <Play className="w-4 h-4" /> Run Code
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code" className="gap-2">
            <Code className="w-4 h-4" /> Code
          </TabsTrigger>
          <TabsTrigger value="run" className="gap-2">
            <Terminal className="w-4 h-4" /> Output
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code">
          <Card className="bg-slate-950 text-slate-50 p-4 font-mono text-sm overflow-auto max-h-[400px]">
            <pre>{data.code}</pre>
          </Card>
        </TabsContent>

        <TabsContent value="run">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px]">
            {/* Output/Preview Area */}
            <Card className="h-full overflow-hidden bg-white border-2">
              <iframe
                ref={iframeRef}
                title="sandbox"
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            </Card>

            {/* Console Logs */}
            <Card className="h-full bg-slate-900 text-green-400 font-mono text-xs p-2 flex flex-col">
              <div className="border-b border-slate-700 pb-2 mb-2 font-bold text-slate-400">
                Console Output
              </div>
              <ScrollArea className="flex-1">
                {logs.length === 0 ? (
                  <span className="text-slate-600 italic">No output...</span>
                ) : (
                  logs.map((log, i) => (
                    <div
                      key={i}
                      className="mb-1 border-b border-slate-800/50 pb-1 last:border-0 hover:bg-slate-800/20"
                    >
                      {log}
                    </div>
                  ))
                )}
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
