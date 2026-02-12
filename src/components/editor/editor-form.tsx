"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StructuredData } from "@/types";
import { TagInput } from "./tag-input";
import { ListInput } from "./list-input";

interface EditorFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  data: StructuredData;
  onDataChange: (data: StructuredData) => void;
}

export function EditorForm({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
  data,
  onDataChange,
}: EditorFormProps) {
  const updateField = <K extends keyof StructuredData>(
    key: K,
    value: StructuredData[K]
  ) => {
    onDataChange({ ...data, [key]: value });
  };

  const updateStyle = (
    key: keyof StructuredData["style"],
    value: string
  ) => {
    onDataChange({
      ...data,
      style: { ...data.style, [key]: value },
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-6">
        {/* Basic Info */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            基本信息
          </h3>
          <div className="space-y-2">
            <Label htmlFor="title">人设名称 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="例：资深前端工程师"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">简短描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="简要说明这个人设的用途..."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>标签</Label>
            <TagInput
              value={tags}
              onChange={onTagsChange}
              placeholder="输入标签后按 Enter..."
            />
          </div>
        </section>

        <Separator />

        {/* Role & Background */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            角色设定
          </h3>
          <div className="space-y-2">
            <Label htmlFor="role">角色 *</Label>
            <Input
              id="role"
              value={data.role}
              onChange={(e) => updateField("role", e.target.value)}
              placeholder="例：资深前端工程师"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="background">背景</Label>
            <Textarea
              id="background"
              value={data.background}
              onChange={(e) => updateField("background", e.target.value)}
              placeholder="详细描述这个角色的背景信息..."
              rows={4}
            />
          </div>
        </section>

        <Separator />

        {/* Skills */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            技能
          </h3>
          <ListInput
            value={data.skills}
            onChange={(skills) => updateField("skills", skills)}
            placeholder="添加一项技能..."
          />
        </section>

        <Separator />

        {/* Style */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            风格
          </h3>
          <div className="space-y-2">
            <Label htmlFor="tone">语气</Label>
            <Input
              id="tone"
              value={data.style.tone}
              onChange={(e) => updateStyle("tone", e.target.value)}
              placeholder="例：专业且友好"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">语言</Label>
            <Input
              id="language"
              value={data.style.language}
              onChange={(e) => updateStyle("language", e.target.value)}
              placeholder="例：中文"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">输出格式</Label>
            <Input
              id="format"
              value={data.style.format}
              onChange={(e) => updateStyle("format", e.target.value)}
              placeholder="例：先给结论，再给解释"
            />
          </div>
        </section>

        <Separator />

        {/* Constraints */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            约束条件
          </h3>
          <ListInput
            value={data.constraints}
            onChange={(constraints) => updateField("constraints", constraints)}
            placeholder="添加一条约束..."
          />
        </section>

        <Separator />

        {/* Examples */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            示例
          </h3>
          <ListInput
            value={data.examples}
            onChange={(examples) => updateField("examples", examples)}
            placeholder="添加一个对话示例..."
            multiline
          />
        </section>
      </div>
    </ScrollArea>
  );
}
