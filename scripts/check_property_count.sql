-- Check total number of properties in database
SELECT COUNT(*) as total_properties FROM properties;

-- Check properties by status
SELECT status, COUNT(*) as count 
FROM properties 
GROUP BY status;

-- Check featured properties
SELECT COUNT(*) as featured_properties 
FROM properties 
WHERE featured = true;

-- List all properties with basic info
SELECT id, title, location, price, status, featured
FROM properties
ORDER BY created_at DESC;
