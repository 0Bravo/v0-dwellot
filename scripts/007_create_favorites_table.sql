-- Create favorites (saved properties) table

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
-- Users can only view their own favorites
CREATE POLICY "favorites_select_own"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own favorites
CREATE POLICY "favorites_insert_own"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own favorites
CREATE POLICY "favorites_delete_own"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_property_id_idx ON public.favorites(property_id);
