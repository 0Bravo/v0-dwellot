-- Create inquiries table for property inquiries

CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id INTEGER NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inquiries
-- Users can view their own inquiries
CREATE POLICY "inquiries_select_own"
  ON public.inquiries FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = inquiries.property_id AND agent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Anyone can insert inquiries (even non-authenticated users)
CREATE POLICY "inquiries_insert_all"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- Only property agents and admins can update inquiry status
CREATE POLICY "inquiries_update_agents"
  ON public.inquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = inquiries.property_id AND agent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS inquiries_property_id_idx ON public.inquiries(property_id);
CREATE INDEX IF NOT EXISTS inquiries_user_id_idx ON public.inquiries(user_id);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries(status);

-- Create updated_at trigger
CREATE TRIGGER inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
