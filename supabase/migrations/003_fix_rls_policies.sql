-- Complete RLS Fix v2 - Allows both creators AND invited participants to access negotiations
-- Run this in Supabase SQL Editor

-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "templates_select" ON public.templates;
DROP POLICY IF EXISTS "negotiations_select" ON public.negotiations;
DROP POLICY IF EXISTS "negotiations_insert" ON public.negotiations;
DROP POLICY IF EXISTS "negotiations_update" ON public.negotiations;
DROP POLICY IF EXISTS "participants_select" ON public.participants;
DROP POLICY IF EXISTS "participants_insert" ON public.participants;
DROP POLICY IF EXISTS "participants_update" ON public.participants;
DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
DROP POLICY IF EXISTS "contracts_select" ON public.contracts;
DROP POLICY IF EXISTS "contracts_insert" ON public.contracts;

-- Drop old policies too (in case they exist)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view templates" ON public.templates;
DROP POLICY IF EXISTS "Users can view their negotiations" ON public.negotiations;
DROP POLICY IF EXISTS "Users can view negotiations" ON public.negotiations;
DROP POLICY IF EXISTS "Users can create negotiations" ON public.negotiations;
DROP POLICY IF EXISTS "Users can update their negotiations" ON public.negotiations;
DROP POLICY IF EXISTS "Users can update negotiations" ON public.negotiations;
DROP POLICY IF EXISTS "Users can view participants" ON public.participants;
DROP POLICY IF EXISTS "Users can add participants to their negotiations" ON public.participants;
DROP POLICY IF EXISTS "Users can add participants" ON public.participants;
DROP POLICY IF EXISTS "Users can update their participant status" ON public.participants;
DROP POLICY IF EXISTS "Users can update own participant" ON public.participants;
DROP POLICY IF EXISTS "Users can view messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users can create contracts" ON public.contracts;

-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.user_has_negotiation_access(UUID);

-- Step 2: Create helper function (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION public.user_has_negotiation_access(neg_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  -- Check if user created the negotiation OR is a participant
  SELECT EXISTS (
    SELECT 1 FROM public.negotiations WHERE id = neg_id AND created_by = auth.uid()
    UNION ALL
    SELECT 1 FROM public.participants WHERE negotiation_id = neg_id AND user_id = auth.uid()
  ) INTO has_access;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Step 3: Create all policies

-- PROFILES: Everyone can see profiles, users can edit their own
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- TEMPLATES: Public read access
CREATE POLICY "templates_select" ON public.templates FOR SELECT USING (true);

-- NEGOTIATIONS: Creator OR participants can access
CREATE POLICY "negotiations_select" ON public.negotiations 
  FOR SELECT USING (public.user_has_negotiation_access(id));

CREATE POLICY "negotiations_insert" ON public.negotiations 
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "negotiations_update" ON public.negotiations 
  FOR UPDATE USING (public.user_has_negotiation_access(id));

-- PARTICIPANTS: Can see if you're in the negotiation, can insert for your negotiations
CREATE POLICY "participants_select" ON public.participants 
  FOR SELECT USING (
    user_id = auth.uid() OR 
    negotiation_id IN (SELECT id FROM public.negotiations WHERE created_by = auth.uid())
  );

CREATE POLICY "participants_insert" ON public.participants 
  FOR INSERT WITH CHECK (
    negotiation_id IN (SELECT id FROM public.negotiations WHERE created_by = auth.uid())
  );

CREATE POLICY "participants_update" ON public.participants 
  FOR UPDATE USING (user_id = auth.uid());

-- MESSAGES: Anyone with negotiation access can read/write
CREATE POLICY "messages_select" ON public.messages 
  FOR SELECT USING (public.user_has_negotiation_access(negotiation_id));

CREATE POLICY "messages_insert" ON public.messages 
  FOR INSERT WITH CHECK (public.user_has_negotiation_access(negotiation_id) OR sender_type = 'ai');

-- CONTRACTS: Anyone with negotiation access can read/write
CREATE POLICY "contracts_select" ON public.contracts 
  FOR SELECT USING (public.user_has_negotiation_access(negotiation_id));

CREATE POLICY "contracts_insert" ON public.contracts 
  FOR INSERT WITH CHECK (public.user_has_negotiation_access(negotiation_id));
