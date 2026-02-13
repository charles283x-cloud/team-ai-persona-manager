"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { EditorForm } from "@/components/editor/editor-form";
import { PromptPreview } from "@/components/editor/prompt-preview";
import { Button } from "@/components/ui/button";
import { usePersona, useUpdatePersona } from "@/hooks/use-personas";
import { compilePrompt } from "@/lib/prompt-compiler";
import { defaultStructuredData, StructuredData } from "@/types";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

export default function EditEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: persona, isLoading } = usePersona(id);
  const updateMutation = useUpdatePersona();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [data, setData] = useState<StructuredData>(defaultStructuredData);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (persona && !initialized) {
      setTitle(persona.title);
      setDescription(persona.description);
      setTags(persona.tags || []);
      setData(persona.structured_data || defaultStructuredData);
      setInitialized(true);
    }
  }, [persona, initialized]);

  const compiledPrompt = useMemo(() => compilePrompt(data), [data]);

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      await updateMutation.mutateAsync({
        id,
        updates: {
          title: title.trim(),
          description: description.trim(),
          structured_data: data,
          compiled_prompt: compiledPrompt,
          tags,
        },
      });
      router.push(`/persona/${id}`);
    } catch (error) {
      console.error("Failed to update persona:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="编辑分身"
        description={persona?.title}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-1 h-4 w-4" />
                返回
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!title.trim() || updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1 h-4 w-4" />
              )}
              保存
            </Button>
          </div>
        }
      />
      <div className="flex-1 grid grid-cols-2 min-h-0">
        <EditorForm
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          tags={tags}
          onTagsChange={setTags}
          data={data}
          onDataChange={setData}
        />
        <PromptPreview prompt={compiledPrompt} />
      </div>
    </div>
  );
}
