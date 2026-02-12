-- Update select Ghana properties to be featured on the homepage
-- Selecting 8 diverse properties across different locations and price points

UPDATE properties 
SET featured = true, updated_at = NOW()
WHERE title IN (
  'Luxury 3-Bedroom Apartment in Airport Residential',
  'Spacious 4-Bedroom House in East Legon',
  'Modern 2-Bedroom Apartment in Cantonments',
  'Executive 5-Bedroom Villa in Ridge',
  'Elegant 3-Bedroom Townhouse in Aburi',
  'Stunning 6-Bedroom Mansion in Trasacco Valley',
  'Contemporary 4-Bedroom House in Kumasi',
  'Affordable 2-Bedroom Apartment in Kasoa'
);

-- Verify the update
SELECT id, title, location, price, featured 
FROM properties 
WHERE featured = true
ORDER BY price DESC;
