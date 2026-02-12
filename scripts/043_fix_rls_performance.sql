-- Fix RLS Performance Issues
-- Replaces auth.uid() with (select auth.uid()) to prevent re-evaluation per row
-- This significantly improves query performance at scale

-- ============================================
-- PROFILES TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Recreate with optimized auth check
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (id = (select auth.uid()));

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE
  USING (id = (select auth.uid()));

-- ============================================
-- PROPERTIES TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "properties_select_active" ON public.properties;
DROP POLICY IF EXISTS "properties_insert_agents" ON public.properties;
DROP POLICY IF EXISTS "properties_update_own" ON public.properties;
DROP POLICY IF EXISTS "properties_delete_own" ON public.properties;

-- Recreate with optimized auth check
CREATE POLICY "properties_select_active" ON public.properties
  FOR SELECT
  USING (
    status = 'active' 
    OR agent_id = (select auth.uid())
  );

CREATE POLICY "properties_insert_agents" ON public.properties
  FOR INSERT
  WITH CHECK (
    agent_id = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid())
      AND role IN ('agent', 'admin')
    )
  );

CREATE POLICY "properties_update_own" ON public.properties
  FOR UPDATE
  USING (agent_id = (select auth.uid()));

CREATE POLICY "properties_delete_own" ON public.properties
  FOR DELETE
  USING (agent_id = (select auth.uid()));

-- ============================================
-- FAVORITES TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "favorites_select_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_insert_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_delete_own" ON public.favorites;

-- Recreate with optimized auth check
CREATE POLICY "favorites_select_own" ON public.favorites
  FOR SELECT
  USING (user_id = (select auth.uid()));

CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE
  USING (user_id = (select auth.uid()));

-- ============================================
-- INQUIRIES TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "inquiries_select_own" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_update_agents" ON public.inquiries;

-- Recreate with optimized auth check
CREATE POLICY "inquiries_select_own" ON public.inquiries
  FOR SELECT
  USING (
    user_id = (select auth.uid())
    OR property_id IN (
      SELECT id FROM public.properties 
      WHERE agent_id = (select auth.uid())
    )
  );

CREATE POLICY "inquiries_update_agents" ON public.inquiries
  FOR UPDATE
  USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE agent_id = (select auth.uid())
    )
  );

-- ============================================
-- REVIEWS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "reviews_insert_authenticated" ON public.reviews;
DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete_own" ON public.reviews;

-- Recreate with optimized auth check
CREATE POLICY "reviews_insert_authenticated" ON public.reviews
  FOR INSERT
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE
  USING (user_id = (select auth.uid()));

CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE
  USING (user_id = (select auth.uid()));

-- ============================================
-- PROPERTY_VIEWS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "property_views_select_agents" ON public.property_views;

-- Recreate with optimized auth check
CREATE POLICY "property_views_select_agents" ON public.property_views
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE agent_id = (select auth.uid())
    )
  );

-- ============================================
-- NEWSLETTER_SUBSCRIBERS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Only admin can view newsletter subscribers" ON public.newsletter_subscribers;

-- Recreate with optimized auth check
CREATE POLICY "Only admin can view newsletter subscribers" ON public.newsletter_subscribers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- ============================================
-- SAVED_SEARCHES TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own saved searches" ON public.saved_searches;
DROP POLICY IF EXISTS "Users can insert own saved searches" ON public.saved_searches;
DROP POLICY IF EXISTS "Users can update own saved searches" ON public.saved_searches;
DROP POLICY IF EXISTS "Users can delete own saved searches" ON public.saved_searches;

-- Recreate with optimized auth check
CREATE POLICY "Users can view own saved searches" ON public.saved_searches
  FOR SELECT
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own saved searches" ON public.saved_searches
  FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own saved searches" ON public.saved_searches
  FOR UPDATE
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own saved searches" ON public.saved_searches
  FOR DELETE
  USING (user_id = (select auth.uid()));

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify all policies are updated
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
