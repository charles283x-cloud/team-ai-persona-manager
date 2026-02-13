-- ============================================
-- Team AI Persona Manager - Database Schema
-- ============================================

-- 1. 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 创建 personas 表
CREATE TABLE public.personas (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  -- 结构化数据：存储 role / skills / style / background / constraints 等
  structured_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- 编译后的完整 System Prompt 文本
  compiled_prompt TEXT NOT NULL DEFAULT '',
  -- 标签数组，方便筛选
  tags          TEXT[] DEFAULT '{}',
  -- 创建者（关联 Supabase Auth）
  creator_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- 是否公开给团队所有人（分身）
  is_public     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 3. 创建索引（提升查询性能）
CREATE INDEX idx_personas_creator ON public.personas(creator_id);
CREATE INDEX idx_personas_tags    ON public.personas USING GIN(tags);
CREATE INDEX idx_personas_title   ON public.personas USING GIN(to_tsvector('simple', title));

-- 4. 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_personas_updated
  BEFORE UPDATE ON public.personas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. 启用行级安全策略 (RLS)
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;

-- 所有已登录用户可以查看公开的人设
CREATE POLICY "team_members_can_view"
  ON public.personas FOR SELECT
  USING (is_public = TRUE OR auth.uid() = creator_id);

-- 已登录用户可以创建人设
CREATE POLICY "authenticated_can_create"
  ON public.personas FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- 仅创建者可以编辑自己的人设
CREATE POLICY "creator_can_update"
  ON public.personas FOR UPDATE
  USING (auth.uid() = creator_id);

-- 仅创建者可以删除自己的人设
CREATE POLICY "creator_can_delete"
  ON public.personas FOR DELETE
  USING (auth.uid() = creator_id);
