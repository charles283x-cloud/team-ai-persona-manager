"use client";

import { useParams } from "next/navigation";
import { usePersona } from "@/hooks/use-personas";
import { CopyButton } from "@/components/persona/copy-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Calendar, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/providers/supabase-provider";

export default function PersonaViewPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: persona, isLoading } = usePersona(id);
  const { user } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">人设不存在或无权查看</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回仪表盘
          </Link>
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === persona.creator_id;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="mr-1 h-4 w-4" />
              返回
            </Link>
          </Button>
          {isOwner && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/editor/${persona.id}`}>
                <Edit className="mr-1 h-4 w-4" />
                编辑
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{persona.title}</h1>
              {persona.description && (
                <p className="text-muted-foreground">{persona.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                创建于{" "}
                {new Date(persona.created_at).toLocaleDateString("zh-CN")}
              </span>
            </div>
            <span>
              更新于{" "}
              {new Date(persona.updated_at).toLocaleDateString("zh-CN")}
            </span>
          </div>
          {persona.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {persona.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Compiled Prompt */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">System Prompt</h2>
              <CopyButton text={persona.compiled_prompt} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 border p-4">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {persona.compiled_prompt || "暂无 Prompt 内容"}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Structured Data Overview */}
        {persona.structured_data && (
          <Card>
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold">结构化数据</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {persona.structured_data.role && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    角色
                  </h3>
                  <p className="text-sm">{persona.structured_data.role}</p>
                </div>
              )}
              {persona.structured_data.background && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    背景
                  </h3>
                  <p className="text-sm">{persona.structured_data.background}</p>
                </div>
              )}
              {persona.structured_data.skills?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    技能
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {persona.structured_data.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
