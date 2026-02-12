-- Fix property images with generated images
-- This script updates all properties with proper image paths

-- Update Nova Ridge property
UPDATE properties 
SET images = ARRAY[
  '/images/properties/nova-ridge-plot.jpg'
]
WHERE title LIKE '%Nova Ridge%';

-- Update Oxford Walton 2 Bedroom
UPDATE properties 
SET images = ARRAY[
  '/images/properties/oxford-walton-2bed.jpg'
]
WHERE title LIKE '%Walton 2 Bedroom%';

-- Update Oxford Walton 3 Bedroom
UPDATE properties 
SET images = ARRAY[
  '/images/properties/oxford-walton-3bed.jpg'
]
WHERE title LIKE '%Walton 3 Bedroom%';

-- Update Oxford Eaton
UPDATE properties 
SET images = ARRAY[
  '/images/properties/oxford-eaton.jpg'
]
WHERE title LIKE '%Eaton%';

-- Update Oxford Barton
UPDATE properties 
SET images = ARRAY[
  '/images/properties/oxford-barton.jpg'
]
WHERE title LIKE '%Barton%';

-- Verify all properties have images
SELECT id, title, images 
FROM properties 
ORDER BY created_at DESC;
