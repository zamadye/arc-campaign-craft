-- ============================================
-- FIX 1: Add NOT NULL constraint to user_id columns
-- FIX 2: Recreate all RLS policies as PERMISSIVE
-- ============================================

-- ============================================
-- STEP 1: Add NOT NULL constraints to prevent orphaned data
-- ============================================

-- campaigns table
ALTER TABLE public.campaigns 
ALTER COLUMN user_id SET NOT NULL;

-- nfts table
ALTER TABLE public.nfts 
ALTER COLUMN user_id SET NOT NULL;

-- profiles table
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

-- ============================================
-- STEP 2: Drop all existing RESTRICTIVE policies
-- ============================================

-- Drop campaigns policies
DROP POLICY IF EXISTS campaigns_select_owner ON public.campaigns;
DROP POLICY IF EXISTS campaigns_insert_owner ON public.campaigns;
DROP POLICY IF EXISTS campaigns_update_owner ON public.campaigns;
DROP POLICY IF EXISTS campaigns_delete_owner ON public.campaigns;
DROP POLICY IF EXISTS campaigns_service_scoped ON public.campaigns;

-- Drop nfts policies
DROP POLICY IF EXISTS nfts_select_owner ON public.nfts;
DROP POLICY IF EXISTS nfts_insert_owner ON public.nfts;
DROP POLICY IF EXISTS nfts_update_owner ON public.nfts;
DROP POLICY IF EXISTS nfts_delete_owner ON public.nfts;
DROP POLICY IF EXISTS nfts_service_scoped ON public.nfts;

-- Drop profiles policies
DROP POLICY IF EXISTS profiles_select_owner ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_owner ON public.profiles;
DROP POLICY IF EXISTS profiles_update_owner ON public.profiles;
DROP POLICY IF EXISTS profiles_delete_owner ON public.profiles;
DROP POLICY IF EXISTS profiles_service_scoped ON public.profiles;

-- ============================================
-- STEP 3: Recreate all policies as PERMISSIVE (explicit)
-- Using simplified single policy per role pattern for clarity
-- ============================================

-- CAMPAIGNS: Authenticated user owns their data
CREATE POLICY campaigns_owner_all
ON public.campaigns AS PERMISSIVE
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- CAMPAIGNS: Service role for backend operations
CREATE POLICY campaigns_service_all
ON public.campaigns AS PERMISSIVE
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- NFTS: Authenticated user owns their data
CREATE POLICY nfts_owner_all
ON public.nfts AS PERMISSIVE
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- NFTS: Service role for backend operations
CREATE POLICY nfts_service_all
ON public.nfts AS PERMISSIVE
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- PROFILES: Authenticated user owns their data
CREATE POLICY profiles_owner_all
ON public.profiles AS PERMISSIVE
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- PROFILES: Service role for backend operations
CREATE POLICY profiles_service_all
ON public.profiles AS PERMISSIVE
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- STEP 4: Add trigger to prevent NULL user_id (extra safety)
-- ============================================

CREATE OR REPLACE FUNCTION public.prevent_null_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be NULL. All records must be associated with an authenticated user.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers
DROP TRIGGER IF EXISTS campaigns_check_user_id ON public.campaigns;
CREATE TRIGGER campaigns_check_user_id
BEFORE INSERT OR UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.prevent_null_user_id();

DROP TRIGGER IF EXISTS nfts_check_user_id ON public.nfts;
CREATE TRIGGER nfts_check_user_id
BEFORE INSERT OR UPDATE ON public.nfts
FOR EACH ROW
EXECUTE FUNCTION public.prevent_null_user_id();

DROP TRIGGER IF EXISTS profiles_check_user_id ON public.profiles;
CREATE TRIGGER profiles_check_user_id
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_null_user_id();