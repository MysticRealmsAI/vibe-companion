
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  age_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own profile delete" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Companions
CREATE TABLE public.companions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER,
  gender_identity TEXT,
  species TEXT DEFAULT 'human',
  relationship_type TEXT,
  cultural_background TEXT,
  setting TEXT,
  personality TEXT,
  backstory TEXT,
  speech_style TEXT,
  emotional_traits TEXT,
  moral_conflicts TEXT,
  secrets TEXT,
  powers TEXT,
  appearance_json JSONB DEFAULT '{}'::jsonb,
  clothing_json JSONB DEFAULT '{}'::jsonb,
  preferences_json JSONB DEFAULT '{}'::jsonb,
  dialogue_examples_json JSONB DEFAULT '[]'::jsonb,
  visual_style TEXT DEFAULT 'realistic',
  avatar_url TEXT,
  starter_scenario TEXT,
  first_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.companions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own companions select" ON public.companions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own companions insert" ON public.companions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own companions update" ON public.companions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own companions delete" ON public.companions FOR DELETE USING (auth.uid() = user_id);

-- Chats
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own chats select" ON public.chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own chats insert" ON public.chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own chats update" ON public.chats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own chats delete" ON public.chats FOR DELETE USING (auth.uid() = user_id);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_chat ON public.messages(chat_id, created_at);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages select" ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own messages insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own messages update" ON public.messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own messages delete" ON public.messages FOR DELETE USING (auth.uid() = user_id);

-- Memory summaries
CREATE TABLE public.memory_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL UNIQUE REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary TEXT NOT NULL DEFAULT '',
  message_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.memory_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own summaries select" ON public.memory_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own summaries insert" ON public.memory_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own summaries update" ON public.memory_summaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own summaries delete" ON public.memory_summaries FOR DELETE USING (auth.uid() = user_id);

-- App settings
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',
  response_length TEXT DEFAULT 'medium',
  creativity NUMERIC DEFAULT 0.8,
  writing_style TEXT DEFAULT 'natural',
  model_name TEXT DEFAULT 'nousresearch/hermes-3-llama-3.1-70b',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own settings select" ON public.app_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own settings insert" ON public.app_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own settings update" ON public.app_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own settings delete" ON public.app_settings FOR DELETE USING (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_companions_updated BEFORE UPDATE ON public.companions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_chats_updated BEFORE UPDATE ON public.chats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.app_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
