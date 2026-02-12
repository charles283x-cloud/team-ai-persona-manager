"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface PromptPreviewProps {
  prompt: string;
}

export function PromptPreview({ prompt }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full border-l">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <h3 className="text-sm font-semibold">Prompt 预览</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!prompt}
          className="text-xs"
        >
          {copied ? (
            <>
              <Check className="mr-1 h-3 w-3" />
              已复制
            </>
          ) : (
            <>
              <Copy className="mr-1 h-3 w-3" />
              复制
            </>
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {prompt ? (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-foreground/90">
              {prompt}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              在左侧填写表单，这里会实时生成 System Prompt
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
