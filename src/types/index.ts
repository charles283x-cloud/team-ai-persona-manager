export interface StructuredData {
  role: string;
  background: string;
  skills: string[];
  style: {
    tone: string;
    language: string;
    format: string;
  };
  constraints: string[];
  examples: string[];
}

export const defaultStructuredData: StructuredData = {
  role: "",
  background: "",
  skills: [],
  style: {
    tone: "",
    language: "",
    format: "",
  },
  constraints: [],
  examples: [],
};

export interface Persona {
  id: string;
  title: string;
  description: string;
  structured_data: StructuredData;
  compiled_prompt: string;
  tags: string[];
  creator_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonaInsert {
  title: string;
  description?: string;
  structured_data: StructuredData;
  compiled_prompt: string;
  tags?: string[];
  creator_id: string;
  is_public?: boolean;
}

export interface PersonaUpdate {
  title?: string;
  description?: string;
  structured_data?: StructuredData;
  compiled_prompt?: string;
  tags?: string[];
  is_public?: boolean;
}
