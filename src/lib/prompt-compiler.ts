import { StructuredData } from "@/types";

export function compilePrompt(data: StructuredData): string {
  const sections: string[] = [];

  // Role
  if (data.role.trim()) {
    sections.push(`# Role\n你是一个${data.role}。`);
  }

  // Background
  if (data.background.trim()) {
    sections.push(`## Background\n${data.background}`);
  }

  // Skills
  if (data.skills.length > 0 && data.skills.some((s) => s.trim())) {
    const skillsList = data.skills
      .filter((s) => s.trim())
      .map((s) => `- ${s}`)
      .join("\n");
    sections.push(`## Skills\n${skillsList}`);
  }

  // Style
  const styleEntries: string[] = [];
  if (data.style.tone.trim()) {
    styleEntries.push(`- 语气：${data.style.tone}`);
  }
  if (data.style.language.trim()) {
    styleEntries.push(`- 语言：${data.style.language}`);
  }
  if (data.style.format.trim()) {
    styleEntries.push(`- 输出格式：${data.style.format}`);
  }
  if (styleEntries.length > 0) {
    sections.push(`## Style\n${styleEntries.join("\n")}`);
  }

  // Constraints
  if (data.constraints.length > 0 && data.constraints.some((c) => c.trim())) {
    const constraintsList = data.constraints
      .filter((c) => c.trim())
      .map((c) => `- ${c}`)
      .join("\n");
    sections.push(`## Constraints\n${constraintsList}`);
  }

  // Examples
  if (data.examples.length > 0 && data.examples.some((e) => e.trim())) {
    const examplesList = data.examples
      .filter((e) => e.trim())
      .map((e, i) => `### 示例 ${i + 1}\n${e}`)
      .join("\n\n");
    sections.push(`## Examples\n${examplesList}`);
  }

  return sections.join("\n\n");
}
