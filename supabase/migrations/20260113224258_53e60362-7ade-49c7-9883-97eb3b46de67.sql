-- ============================================================================
-- FIX: Remove NULL user_id bypass from service-scoped RLS policies
-- This addresses the security issue where user_id IS NULL allows bypass
-- ============================================================================

-- Drop existing service_scoped policies that have NULL bypass
DROP POLICY IF EXISTS campaigns_service_scoped ON public.campaigns;
DROP POLICY IF EXISTS nfts_service_scoped ON public.nfts;
DROP POLICY IF EXISTS profiles_service_scoped ON public.profiles;

-- Create new service_scoped policies WITHOUT NULL bypass
-- service_role can only access rows that match the authenticated user's ID
CREATE POLICY campaigns_service_scoped
ON public.campaigns
AS PERMISSIVE
FOR ALL
TO service_role
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY nfts_service_scoped
ON public.nfts
AS PERMISSIVE
FOR ALL
TO service_role
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY profiles_service_scoped
ON public.profiles
AS PERMISSIVE
FOR ALL
TO service_role
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);