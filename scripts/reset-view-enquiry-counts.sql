-- Reset all inflated view_count and enquiry_count to 0
-- The property_views table is empty so current view_count numbers are meaningless
-- Fresh tracking starts now with bot filtering and dedup in place

-- Reset view counts
UPDATE properties SET view_count = 0;

-- Reset enquiry counts
UPDATE properties SET enquiry_count = 0;

-- Clear the property_views table (should already be empty, but just in case)
DELETE FROM property_views;
