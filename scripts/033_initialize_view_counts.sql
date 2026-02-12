-- Initialize view_count to 0 for existing properties with NULL
UPDATE properties SET view_count = 0 WHERE view_count IS NULL;

-- Make view_count default to 0
ALTER TABLE properties ALTER COLUMN view_count SET DEFAULT 0;
