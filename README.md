# Team AI Persona Manager

团队 AI 人设管理器 —— 一个中心化的平台，团队成员可以在这里创建、编辑、存储和共享 AI 的 System Prompts（人设背景）。

## 技术栈

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **UI**: Shadcn/UI + Tailwind CSS (Dashboard 风格)
- **Icons**: Lucide React
- **Backend/DB**: Supabase (PostgreSQL + Auth)
- **State**: TanStack Query (React Query)

## 核心功能

- **Dashboard**: 团队所有人设的卡片列表，支持搜索和标签筛选
- **Editor**: 分栏编辑器 —— 左边填写结构化表单（角色、技能、风格、背景、约束），右边实时预览生成的 System Prompt
- **Sharing**: 保存后，任何团队成员可查看完整 Prompt 并一键复制

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，填入你的 Supabase 项目配置：

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. 初始化数据库

在 Supabase 控制台的 SQL Editor 中执行 `supabase/migrations/20260212_create_personas.sql` 中的建表语句。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── (auth)/             # 登录/注册页面
│   ├── dashboard/          # 仪表盘（人设卡片列表）
│   ├── editor/             # 分栏编辑器（新建/编辑）
│   └── persona/            # 人设查看/分享页面
├── components/
│   ├── ui/                 # Shadcn/UI 组件
│   ├── layout/             # 布局组件（侧边栏、顶部栏）
│   ├── dashboard/          # Dashboard 相关组件
│   ├── editor/             # 编辑器相关组件
│   └── persona/            # 分享页相关组件
├── hooks/                  # TanStack Query hooks
├── lib/                    # 工具函数和 Supabase 配置
├── providers/              # React Context Providers
└── types/                  # TypeScript 类型定义

supabase/
└── migrations/             # SQL 迁移文件
```

## 数据库 Schema

`personas` 表包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | TEXT | 人设名称 |
| description | TEXT | 简短描述 |
| structured_data | JSONB | 结构化数据（角色、技能、风格等） |
| compiled_prompt | TEXT | 编译后的完整 System Prompt |
| tags | TEXT[] | 标签数组 |
| creator_id | UUID | 创建者 ID |
| is_public | BOOLEAN | 是否团队公开 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |
