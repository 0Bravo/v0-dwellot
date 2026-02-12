-- Add multiple images to existing Appolonia properties for carousel functionality
-- This updates each property with 4-5 images from various angles

-- Update Nova Ridge - Standard Serviced Plot
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/nova-ridge-aerial.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/nova-ridge-entrance.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/nova-ridge-plots.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/nova-ridge-amenities.jpg'
]
WHERE title = 'Nova Ridge - Standard Serviced Plot';

-- Update The Oxford - Walton 2 Bedroom
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-exterior.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-living-room.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-kitchen.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-bedroom.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-bathroom.jpg'
]
WHERE title = 'The Oxford - Walton 2 Bedroom Semi-Detached';

-- Update The Oxford - Walton 3 Bedroom
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-3bed-exterior.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-3bed-living.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-3bed-master.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-3bed-kitchen.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/walton-3bed-garden.jpg'
]
WHERE title = 'The Oxford - Walton 3 Bedroom Semi-Detached';

-- Update The Oxford - Eaton 3 Bedroom
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/eaton-exterior.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/eaton-living-room.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/eaton-master-bedroom.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/eaton-kitchen.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/eaton-backyard.jpg'
]
WHERE title = 'The Oxford - Eaton 3 Bedroom Detached';

-- Update The Oxford - Barton 4 Bedroom
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/barton-exterior.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/barton-living-area.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/barton-master-suite.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/barton-kitchen-dining.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2023/05/barton-terrace.jpg'
]
WHERE title = 'The Oxford - Barton 4 Bedroom Townhouse';

-- Verify the updates
SELECT 
  id,
  title,
  array_length(images, 1) as image_count,
  images[1] as first_image
FROM properties
ORDER BY id;
