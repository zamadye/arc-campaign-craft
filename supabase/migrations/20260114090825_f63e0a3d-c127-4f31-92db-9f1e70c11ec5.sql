-- Add columns to store AI generation metadata for auditing and reproducibility
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS image_prompt text,
ADD COLUMN IF NOT EXISTS generation_metadata jsonb DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.campaigns.image_prompt IS 'The visual prompt used to generate the campaign image';
COMMENT ON COLUMN public.campaigns.generation_metadata IS 'JSON metadata: actionOrder, timeWindow, model used, retry count, etc.';