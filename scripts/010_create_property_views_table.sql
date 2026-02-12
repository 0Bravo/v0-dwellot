-- Create property_views table for analytics

CREATE TABLE IF NOT EXISTS public.property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id INTEGER NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_views
-- Property agents and admins can view analytics for their properties
CREATE POLICY "property_views_select_agents"
  ON public.property_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_views.property_id AND agent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Anyone can insert views (for tracking)
CREATE POLICY "property_views_insert_all"
  ON public.property_views FOR INSERT
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS property_views_property_id_idx ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS property_views_viewed_at_idx ON public.property_views(viewed_at);
