-- Cleanup script to remove all placeholder/seeded properties
-- This keeps only user-uploaded properties with real images

-- Delete all seeded properties (those with /images/properties/ paths)
DELETE FROM properties 
WHERE images[1] LIKE '/images/properties/%';

-- Verify what remains
SELECT id, title, images[1] as first_image FROM properties ORDER BY id;
