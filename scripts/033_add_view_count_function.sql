-- Create function to increment view count atomically
CREATE OR REPLACE FUNCTION increment_view_count(property_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE properties 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Initialize view_count to 0 for existing properties with NULL
UPDATE properties SET view_count = 0 WHERE view_count IS NULL;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_view_count(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(INTEGER) TO anon;
