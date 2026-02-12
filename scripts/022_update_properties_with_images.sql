-- First, let's see what we have
SELECT id, title, images FROM properties;

-- Update Nova Ridge property with multiple images
UPDATE properties
SET images = ARRAY[
  '/images/properties/nova-ridge-plot.jpg',
  '/images/properties/nova-ridge-aerial.jpg',
  '/images/properties/nova-ridge-entrance.jpg',
  '/images/properties/nova-ridge-amenities.jpg'
]
WHERE title LIKE '%Nova Ridge%';

-- Update Oxford Walton 2 Bedroom
UPDATE properties
SET images = ARRAY[
  '/images/properties/oxford-walton-2bed.jpg',
  '/images/properties/oxford-walton-2bed-interior.jpg',
  '/images/properties/oxford-walton-2bed-kitchen.jpg',
  '/images/properties/oxford-walton-2bed-bedroom.jpg'
]
WHERE title LIKE '%Walton 2 Bedroom%';

-- Update Oxford Walton 3 Bedroom
UPDATE properties
SET images = ARRAY[
  '/images/properties/oxford-walton-3bed.jpg',
  '/images/properties/oxford-walton-3bed-interior.jpg',
  '/images/properties/oxford-walton-3bed-kitchen.jpg',
  '/images/properties/oxford-walton-3bed-master.jpg'
]
WHERE title LIKE '%Walton 3 Bedroom%';

-- Update Oxford Eaton
UPDATE properties
SET images = ARRAY[
  '/images/properties/oxford-eaton.jpg',
  '/images/properties/oxford-eaton-interior.jpg',
  '/images/properties/oxford-eaton-kitchen.jpg',
  '/images/properties/oxford-eaton-bedroom.jpg'
]
WHERE title LIKE '%Eaton%';

-- Update Oxford Barton
UPDATE properties
SET images = ARRAY[
  '/images/properties/oxford-barton.jpg',
  '/images/properties/oxford-barton-interior.jpg',
  '/images/properties/oxford-barton-kitchen.jpg',
  '/images/properties/oxford-barton-master.jpg'
]
WHERE title LIKE '%Barton%';

-- Verify the update
SELECT id, title, images FROM properties;
