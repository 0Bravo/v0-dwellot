-- Update properties to use the new realistic AI images
-- These are hosted locally so they will ALWAYS load

-- 1. Nova Ridge (Land Plot)
UPDATE properties 
SET images = ARRAY[
    '/images/properties/realistic/nova-ridge-plot.jpg',
    '/images/properties/realistic/nova-ridge-gate.jpg'
]
WHERE title LIKE '%Nova Ridge%';

-- 2. The Oxford - Walton (Semi-Detached)
UPDATE properties 
SET images = ARRAY[
    '/images/properties/realistic/oxford-walton-ext.jpg',
    '/images/properties/realistic/oxford-walton-int.jpg',
    '/images/properties/realistic/oxford-eaton-kitchen.jpg' -- Sharing kitchen style
]
WHERE title LIKE '%Walton%';

-- 3. The Oxford - Eaton (Detached)
UPDATE properties 
SET images = ARRAY[
    '/images/properties/realistic/oxford-eaton-ext.jpg',
    '/images/properties/realistic/oxford-walton-int.jpg', -- Sharing living room style
    '/images/properties/realistic/oxford-eaton-kitchen.jpg'
]
WHERE title LIKE '%Eaton%';

-- 4. The Oxford - Barton (Townhouse)
UPDATE properties 
SET images = ARRAY[
    '/images/properties/realistic/oxford-barton-ext.jpg',
    '/images/properties/realistic/oxford-walton-int.jpg',
    '/images/properties/realistic/oxford-barton-bedroom.jpg'
]
WHERE title LIKE '%Barton%';

-- 5. Industrial Park / Commercial
UPDATE properties 
SET images = ARRAY[
    '/images/properties/realistic/industrial-park.jpg'
]
WHERE title LIKE '%Industrial%' OR title LIKE '%Office%';

-- Verify the updates
SELECT id, title, images[1] as main_image FROM properties ORDER BY id;
