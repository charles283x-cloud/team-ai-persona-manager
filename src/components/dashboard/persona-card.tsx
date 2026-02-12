"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Persona } from "@/types";
import { Copy, Edit, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDeletePersona } from "@/hooks/use-personas";
import { useUser } from "@/providers/supabase-provider";

interface PersonaCardProps {
  persona: Persona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
  const { user } = useUser();
  const deleteMutation = useDeletePersona();
  const isOwner = user?.id === persona.creator_id;

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(persona.compiled_prompt);
  };

  const handleDelete = () => {
    if (confirm("确定要删除这个人设吗？")) {
      deleteMutation.mutate(persona.id);
    }
  };

  return (
    <Card className="group flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-base leading-snug truncate">
              {persona.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-xs">
              {persona.description || "暂无描述"}
            </CardDescription>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/editor/${persona.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    编辑
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-1">
          {persona.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {persona.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{persona.tags.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={handleCopyPrompt}
        >
          <Copy className="mr-1 h-3 w-3" />
          复制 Prompt
        </Button>
        <Button variant="ghost" size="sm" className="text-xs" asChild>
          <Link href={`/persona/${persona.id}`}>
            <ExternalLink className="mr-1 h-3 w-3" />
            查看
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
