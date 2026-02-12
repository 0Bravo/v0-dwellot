-- Update existing properties with multiple images
-- This script adds 3-5 images per property for carousel functionality

-- Nova Ridge - Standard Serviced Plot
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Aerial-View.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Gate.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Roads.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Amenities.jpg'
]
WHERE title = 'Nova Ridge - Standard Serviced Plot';

-- The Oxford - Walton 2 Bedroom
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Exterior.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Living-Room.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Kitchen.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Bedroom.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Bathroom.jpg'
]
WHERE title = 'The Oxford - Walton 2 Bedroom Semi-Detached';

-- The Oxford - Walton 3 Bedroom
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Exterior.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Living.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Kitchen.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Master.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Garden.jpg'
]
WHERE title = 'The Oxford - Walton 3 Bedroom Semi-Detached';

-- The Oxford - Eaton 3 Bedroom
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Exterior.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Living-Room.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Dining.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Kitchen.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Master-Bedroom.jpg'
]
WHERE title = 'The Oxford - Eaton 3 Bedroom Detached';

-- The Oxford - Barton 4 Bedroom
UPDATE properties 
SET images = ARRAY[
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Exterior.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Living.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Kitchen.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Master.jpg',
  'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Balcony.jpg'
]
WHERE title = 'The Oxford - Barton 4 Bedroom Townhouse';

-- Verify the updates
SELECT 
  id,
  title,
  array_length(images, 1) as image_count,
  images
FROM properties
ORDER BY id;
