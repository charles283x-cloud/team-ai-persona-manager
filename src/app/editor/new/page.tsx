"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { EditorForm } from "@/components/editor/editor-form";
import { PromptPreview } from "@/components/editor/prompt-preview";
import { Button } from "@/components/ui/button";
import { useCreatePersona } from "@/hooks/use-personas";
import { useUser } from "@/providers/supabase-provider";
import { compilePrompt } from "@/lib/prompt-compiler";
import { defaultStructuredData, StructuredData } from "@/types";
import { Loader2, Save } from "lucide-react";

export default function NewEditorPage() {
  const router = useRouter();
  const { user } = useUser();
  const createMutation = useCreatePersona();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [data, setData] = useState<StructuredData>(defaultStructuredData);

  const compiledPrompt = useMemo(() => compilePrompt(data), [data]);

  const handleSave = async () => {
    if (!title.trim() || !user) return;

    try {
      const persona = await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        structured_data: data,
        compiled_prompt: compiledPrompt,
        tags,
        creator_id: user.id,
      });
      router.push(`/persona/${persona.id}`);
    } catch (error) {
      console.error("Failed to create persona:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="新建分身"
        description="创建一个新的 AI 分身"
        actions={
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!title.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1 h-4 w-4" />
            )}
            保存
          </Button>
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
