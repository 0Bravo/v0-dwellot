-- Create reviews table for property reviews and ratings

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id INTEGER NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, user_id)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
-- Everyone can view reviews
CREATE POLICY "reviews_select_all"
  ON public.reviews FOR SELECT
  USING (true);

-- Only authenticated users can insert reviews
CREATE POLICY "reviews_insert_authenticated"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own reviews
CREATE POLICY "reviews_update_own"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews, admins can delete all
CREATE POLICY "reviews_delete_own"
  ON public.reviews FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS reviews_property_id_idx ON public.reviews(property_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON public.reviews(rating);

-- Create updated_at trigger
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
