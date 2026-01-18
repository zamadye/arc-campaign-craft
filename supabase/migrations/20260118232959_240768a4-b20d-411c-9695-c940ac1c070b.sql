-- Create generation_history table for AI learning and duplicate prevention
CREATE TABLE public.generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  wallet_address TEXT NOT NULL,
  caption TEXT NOT NULL,
  caption_hash TEXT NOT NULL,
  image_prompt TEXT,
  image_url TEXT,
  dapps_context TEXT[] DEFAULT '{}',
  action_context TEXT[] DEFAULT '{}',
  style_used TEXT,
  tone_used TEXT[] DEFAULT '{}',
  color_palette TEXT,
  visual_theme TEXT,
  pov_perspective TEXT,
  is_verified_twitter BOOLEAN DEFAULT false,
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique index on caption_hash to prevent duplicates
CREATE UNIQUE INDEX idx_generation_history_caption_hash ON public.generation_history(caption_hash);

-- Create index for user queries
CREATE INDEX idx_generation_history_user_wallet ON public.generation_history(user_id, wallet_address);

-- Create index for recent generations lookup
CREATE INDEX idx_generation_history_generated_at ON public.generation_history(generated_at DESC);

-- Enable RLS
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own generation history
CREATE POLICY "generation_history_select_own" ON public.generation_history
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- RLS Policy: Users can only insert their own generation history
CREATE POLICY "generation_history_insert_own" ON public.generation_history
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Service role has full access for backend operations
CREATE POLICY "generation_history_service_all" ON public.generation_history
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Add trigger for preventing null user_id
CREATE TRIGGER prevent_null_user_id_generation_history
BEFORE INSERT OR UPDATE ON public.generation_history
FOR EACH ROW
EXECUTE FUNCTION public.prevent_null_user_id();