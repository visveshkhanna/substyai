import React, { useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolOutputProps {
  toolName: string;
  result?: Record<string, string>;
  className?: string;
  loading?: boolean;
}

export const ToolOutput: React.FC<ToolOutputProps> = ({
  toolName,
  result,
  className,
  loading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("border rounded-md", className)}>
      <div
        className={cn(
          "flex items-center justify-between p-3 bg-muted",
          loading ? "cursor-not-allowed" : "cursor-pointer hover:bg-muted/80"
        )}
        onClick={() => !loading && setIsExpanded(!isExpanded)}
        role="button"
      >
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
          <h3 className="font-medium">{toolName}</h3>
        </div>
      </div>

      {isExpanded && !loading && result && (
        <div className="border-t p-3">
          <div
            className="max-w-full overflow-x-auto"
            style={{ maxWidth: "calc(100vw - 6rem)" }}
          >
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
