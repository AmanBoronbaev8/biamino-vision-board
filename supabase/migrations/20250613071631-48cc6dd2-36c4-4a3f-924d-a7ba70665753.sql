
-- Создаем enum для ролей пользователей
CREATE TYPE public.user_role AS ENUM ('admin', 'user', 'team');

-- Создаем enum для отделов
CREATE TYPE public.department_type AS ENUM ('present', 'future');

-- Создаем таблицу пользователей
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Вставляем предустановленных пользователей
INSERT INTO public.users (email, role) VALUES
  ('admin@biamino.com', 'admin'),
  ('user@biamino.com', 'user'),
  ('team@biamino.com', 'team');

-- Создаем таблицу проектов
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '📝',
  department department_type NOT NULL,
  status TEXT NOT NULL,
  secondary_status TEXT,
  goal TEXT,
  github_url TEXT,
  revenue BOOLEAN DEFAULT FALSE,
  revenue_amount TEXT,
  requirements TEXT,
  inventory TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- NDA flags
  goal_is_nda BOOLEAN DEFAULT FALSE,
  requirements_is_nda BOOLEAN DEFAULT FALSE,
  inventory_is_nda BOOLEAN DEFAULT FALSE,
  description_is_nda BOOLEAN DEFAULT FALSE
);

-- Создаем таблицу кастомных полей
CREATE TABLE public.custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT,
  is_nda BOOLEAN DEFAULT FALSE
);

-- Создаем таблицу ссылок проектов
CREATE TABLE public.project_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT
);

-- Создаем таблицу комментариев
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем Row Level Security для всех таблиц
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Создаем политики для пользователей (все могут читать)
CREATE POLICY "Everyone can view users" ON public.users FOR SELECT USING (true);

-- Создаем политики для проектов
CREATE POLICY "Everyone can view public projects" ON public.projects 
  FOR SELECT USING (NOT is_private OR true);

CREATE POLICY "Admins can manage projects" ON public.projects 
  FOR ALL USING (true);

-- Политики для кастомных полей
CREATE POLICY "Everyone can view custom fields" ON public.custom_fields 
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage custom fields" ON public.custom_fields 
  FOR ALL USING (true);

-- Политики для ссылок проектов
CREATE POLICY "Everyone can view project links" ON public.project_links 
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage project links" ON public.project_links 
  FOR ALL USING (true);

-- Политики для комментариев
CREATE POLICY "Everyone can view comments" ON public.comments 
  FOR SELECT USING (true);

CREATE POLICY "Everyone can create comments" ON public.comments 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can delete comments" ON public.comments 
  FOR DELETE USING (true);

-- Создаем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
