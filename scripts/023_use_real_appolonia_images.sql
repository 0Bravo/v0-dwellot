-- Update Nova Ridge
UPDATE properties 
SET images = ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-1.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-2.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-3.jpg'
]
WHERE title LIKE '%Nova Ridge%';

-- Update Oxford Walton (Both 2 and 3 bed use similar exterior shots for now, distinguishing by interior if available or reusing)
UPDATE properties 
SET images = ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Walton-1.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Walton-2.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Street-View.jpg'
]
WHERE title LIKE '%Walton%';

-- Update Oxford Eaton
UPDATE properties 
SET images = ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Eaton-1.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Eaton-2.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Clubhouse.jpg'
]
WHERE title LIKE '%Eaton%';

-- Update Oxford Barton
UPDATE properties 
SET images = ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Barton-1.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Barton-2.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Pool.jpg'
]
WHERE title LIKE '%Barton%';

-- Verify the updates
SELECT id, title, images[1] as first_image FROM properties;
