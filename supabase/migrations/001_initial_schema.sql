-- PseudoLawyer Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Users profile extension (Supabase Auth handles core user)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contract templates (pre-defined)
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Negotiations (chat sessions)
CREATE TABLE IF NOT EXISTS public.negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.templates(id),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  contract_data JSONB DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Negotiation participants
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_id UUID REFERENCES public.negotiations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  email TEXT NOT NULL,
  role TEXT DEFAULT 'party' CHECK (role IN ('initiator', 'party')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'joined', 'agreed')),
  joined_at TIMESTAMPTZ,
  agreed_at TIMESTAMPTZ
);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_id UUID REFERENCES public.negotiations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finalized contracts
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_id UUID REFERENCES public.negotiations(id),
  title TEXT NOT NULL,
  final_content JSONB NOT NULL,
  pdf_path TEXT,
  signed_by JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Templates: Everyone can view templates
CREATE POLICY "Anyone can view templates" ON public.templates
  FOR SELECT USING (true);

-- Negotiations: Users can view negotiations they participate in
CREATE POLICY "Users can view their negotiations" ON public.negotiations
  FOR SELECT USING (
    id IN (SELECT negotiation_id FROM public.participants WHERE user_id = auth.uid())
    OR created_by = auth.uid()
  );

CREATE POLICY "Users can create negotiations" ON public.negotiations
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their negotiations" ON public.negotiations
  FOR UPDATE USING (
    id IN (SELECT negotiation_id FROM public.participants WHERE user_id = auth.uid())
  );

-- Participants: Users can view participants in their negotiations
CREATE POLICY "Users can view participants" ON public.participants
  FOR SELECT USING (
    negotiation_id IN (SELECT negotiation_id FROM public.participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can add participants to their negotiations" ON public.participants
  FOR INSERT WITH CHECK (
    negotiation_id IN (SELECT id FROM public.negotiations WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can update their participant status" ON public.participants
  FOR UPDATE USING (user_id = auth.uid());

-- Messages: Users can view messages in their negotiations
CREATE POLICY "Users can view messages" ON public.messages
  FOR SELECT USING (
    negotiation_id IN (SELECT negotiation_id FROM public.participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    negotiation_id IN (SELECT negotiation_id FROM public.participants WHERE user_id = auth.uid())
  );

-- Contracts: Users can view contracts from their negotiations
CREATE POLICY "Users can view contracts" ON public.contracts
  FOR SELECT USING (
    negotiation_id IN (SELECT negotiation_id FROM public.participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create contracts" ON public.contracts
  FOR INSERT WITH CHECK (
    negotiation_id IN (SELECT negotiation_id FROM public.participants WHERE user_id = auth.uid())
  );

-- Enable Realtime on messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_participants_negotiation ON public.participants(negotiation_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON public.participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_negotiation ON public.messages(negotiation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_negotiations_updated_at
  BEFORE UPDATE ON public.negotiations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
