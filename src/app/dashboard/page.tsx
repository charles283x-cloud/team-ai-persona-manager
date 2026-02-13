"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/header";
import { PersonaGrid } from "@/components/dashboard/persona-grid";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { Button } from "@/components/ui/button";
import { usePersonas } from "@/hooks/use-personas";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const { data: personas = [], isLoading } = usePersonas(
    search || undefined,
    selectedTag || undefined
  );

  // Extract all unique tags from personas
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    personas.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [personas]);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="分身仪表盘"
        description="管理团队的所有 AI 分身"
        actions={
          <Button asChild size="sm">
            <Link href="/editor/new">
              <Plus className="mr-1 h-4 w-4" />
              新建分身
            </Link>
          </Button>
        }
      />
      <div className="flex-1 p-6 space-y-6">
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          availableTags={availableTags}
        />
        <PersonaGrid personas={personas} isLoading={isLoading} />
      </div>
    </div>
  );
}
