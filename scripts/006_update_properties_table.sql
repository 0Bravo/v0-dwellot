-- Update properties table to use UUID and reference profiles
-- Add missing columns and enable RLS

-- Add agent_id as UUID if it doesn't exist, otherwise alter it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'agent_id'
  ) THEN
    ALTER TABLE public.properties ADD COLUMN agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add view count for analytics
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Enable RLS on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
-- Everyone can view active properties
CREATE POLICY "properties_select_active"
  ON public.properties FOR SELECT
  USING (status = 'active' OR auth.uid() = agent_id);

-- Only agents and admins can insert properties
CREATE POLICY "properties_insert_agents"
  ON public.properties FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

-- Agents can update their own properties, admins can update all
CREATE POLICY "properties_update_own"
  ON public.properties FOR UPDATE
  USING (
    auth.uid() = agent_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Agents can delete their own properties, admins can delete all
CREATE POLICY "properties_delete_own"
  ON public.properties FOR DELETE
  USING (
    auth.uid() = agent_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS properties_agent_id_idx ON public.properties(agent_id);
CREATE INDEX IF NOT EXISTS properties_status_idx ON public.properties(status);
CREATE INDEX IF NOT EXISTS properties_listing_type_idx ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS properties_featured_idx ON public.properties(featured);
CREATE INDEX IF NOT EXISTS properties_location_idx ON public.properties USING gin(to_tsvector('english', location));
