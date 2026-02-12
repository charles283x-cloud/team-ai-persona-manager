"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onClick={handleCopy}
      disabled={!text}
      className={className}
      size="lg"
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          已复制到剪贴板
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          一键复制 System Prompt
        </>
      )}
    </Button>
  );
}
