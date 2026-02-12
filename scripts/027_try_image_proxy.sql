-- Update properties to use wsrv.nl proxy for Appolonia images
-- This bypasses CORS and hotlinking protection

-- Nova Ridge
UPDATE properties
SET images = ARRAY[
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-1.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-2.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-3.jpg&w=800&q=80'
]
WHERE title LIKE '%Nova Ridge%';

-- Oxford Walton 2 Bed
UPDATE properties
SET images = ARRAY[
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Walton-1.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Walton-2.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Pool.jpg&w=800&q=80'
]
WHERE title LIKE '%Walton 2 Bedroom%';

-- Oxford Walton 3 Bed
UPDATE properties
SET images = ARRAY[
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Walton-1.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Walton-2.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Street.jpg&w=800&q=80'
]
WHERE title LIKE '%Walton 3 Bedroom%';

-- Oxford Eaton
UPDATE properties
SET images = ARRAY[
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Eaton-1.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Eaton-2.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Pool.jpg&w=800&q=80'
]
WHERE title LIKE '%Eaton%';

-- Oxford Barton
UPDATE properties
SET images = ARRAY[
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Barton-1.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Barton-2.jpg&w=800&q=80',
  'https://wsrv.nl/?url=www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Street.jpg&w=800&q=80'
]
WHERE title LIKE '%Barton%';

-- Verify
SELECT id, title, images[1] as first_image FROM properties;
