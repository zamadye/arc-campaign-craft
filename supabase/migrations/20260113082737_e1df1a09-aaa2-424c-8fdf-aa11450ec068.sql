-- ============================================
-- HYBRID AUTH: Add user_id to profiles
-- ============================================

-- Step 1: Add user_id column that links to auth.users
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Step 3: Drop ALL existing RLS policies on profiles for clean slate
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'profiles'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', r.policyname);
  END LOOP;
END $$;

-- Step 4: Ensure FORCE RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;

-- Step 5: Revoke direct access from public roles
REVOKE ALL ON profiles FROM anon;
REVOKE ALL ON profiles FROM public;

-- Step 6: CREATE NEW POLICIES based on auth.uid()

-- SELECT: Owner sees own profile via auth.uid()
CREATE POLICY profiles_select_owner
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT: User creates own profile during registration
CREATE POLICY profiles_insert_owner
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: User updates own profile
CREATE POLICY profiles_update_owner
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service role for edge functions (needed for auth-service to create profiles)
CREATE POLICY profiles_service_all
ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);