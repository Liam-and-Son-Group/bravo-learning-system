import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import {
  AlertCircle,
  ArrowLeft,
  Home,
  Search,
  Compass,
  Puzzle,
  Ghost,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem("access_token");
  const goHome = () => navigate({ to: hasToken ? "/" : "/login" });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center max-w-xl w-full gap-6">
        <div className="flex items-center gap-3 text-5xl font-extrabold tracking-tight">
          <span className="text-foreground/90">4</span>
          <Ghost className="w-14 h-14 text-foreground/60" />
          <span className="text-foreground/90">4</span>
        </div>
        <Card className="w-full border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Lost in Learning Space
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm leading-relaxed">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist, moved, or is
              temporarily unavailable.
            </p>
            <Separator />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={goHome}
              >
                <Home className="w-4 h-4" /> Home
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() =>
                  navigate({ to: accessToken ? "/classrooms" : "/login" })
                }
              >
                <Compass className="w-4 h-4" /> Classrooms
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() =>
                  navigate({ to: accessToken ? "/authoring" : "/login" })
                }
              >
                <Puzzle className="w-4 h-4" /> Authoring
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate({ to: accessToken ? "/" : "/login" })}
              >
                <Search className="w-4 h-4" /> Search
              </Button>
            </div>
            <Separator />
            <div className="flex flex-col gap-2 text-muted-foreground text-xs">
              <p className="font-medium uppercase tracking-wide">
                Possible reasons:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Incorrect or outdated link</li>
                <li>Page was renamed or moved</li>
                <li>Access requires authentication</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate({ to: accessToken ? "/" : "/login" })}
          >
            <Home className="w-4 h-4 mr-1" /> Go Home
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          If you believe this is an error, please contact support or try again
          later.
        </p>
      </div>
    </div>
  );
}
