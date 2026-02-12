"use client";

import { Persona } from "@/types";
import { PersonaCard } from "./persona-card";
import { Bot } from "lucide-react";

interface PersonaGridProps {
  personas: Persona[];
  isLoading: boolean;
}

export function PersonaGrid({ personas, isLoading }: PersonaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[200px] rounded-lg border bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Bot className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">还没有人设</h3>
        <p className="text-sm text-muted-foreground mt-1">
          点击「新建人设」开始创建你的第一个 AI 人设
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {personas.map((persona) => (
        <PersonaCard key={persona.id} persona={persona} />
      ))}
    </div>
  );
}
