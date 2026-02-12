-- Update the 20 Ghana properties with actual generated images
-- This replaces placeholder images with realistic property photos

-- Property 1: Luxury 3 Bedroom Apartment in Airport Residential
UPDATE properties 
SET images = ARRAY[
  '/images/properties/airport-luxury-apt-1.jpg',
  '/images/properties/airport-luxury-apt-2.jpg',
  '/images/properties/airport-luxury-apt-3.jpg',
  '/images/properties/airport-luxury-apt-4.jpg'
]
WHERE title = 'Luxury 3 Bedroom Apartment in Airport Residential';

-- Property 2: 4 Bedroom Detached House in East Legon
UPDATE properties 
SET images = ARRAY[
  '/images/properties/east-legon-house-1.jpg',
  '/images/properties/east-legon-house-2.jpg',
  '/images/properties/east-legon-house-3.jpg',
  '/images/properties/east-legon-house-4.jpg'
]
WHERE title = '4 Bedroom Detached House in East Legon';

-- Property 3: 2 Bedroom Apartment in Cantonments
UPDATE properties 
SET images = ARRAY[
  '/images/properties/cantonments-apt-1.jpg',
  '/images/properties/cantonments-apt-2.jpg',
  '/images/properties/cantonments-apt-3.jpg'
]
WHERE title = '2 Bedroom Apartment in Cantonments';

-- Property 4: 5 Bedroom Villa in Ridge
UPDATE properties 
SET images = ARRAY[
  '/images/properties/ridge-villa-1.jpg',
  '/images/properties/ridge-villa-2.jpg',
  '/images/properties/ridge-villa-3.jpg',
  '/images/properties/ridge-villa-4.jpg'
]
WHERE title = '5 Bedroom Villa in Ridge';

-- Property 5: 3 Bedroom Townhouse in Aburi
UPDATE properties 
SET images = ARRAY[
  '/images/properties/aburi-townhouse-1.jpg',
  '/images/properties/aburi-townhouse-2.jpg',
  '/images/properties/aburi-townhouse-3.jpg'
]
WHERE title = '3 Bedroom Townhouse in Aburi';

-- Property 6: 4 Bedroom House in Kumasi Metropolitan
UPDATE properties 
SET images = ARRAY[
  '/images/properties/kumasi-house-1.jpg',
  '/images/properties/kumasi-house-2.jpg',
  '/images/properties/kumasi-house-3.jpg'
]
WHERE title = '4 Bedroom House in Kumasi Metropolitan';

-- Property 7: 1 Bedroom Studio Apartment in Osu
UPDATE properties 
SET images = ARRAY[
  '/images/properties/osu-studio-1.jpg',
  '/images/properties/osu-studio-2.jpg',
  '/images/properties/osu-studio-3.jpg'
]
WHERE title = '1 Bedroom Studio Apartment in Osu';

-- Property 8: 3 Bedroom Apartment for Rent in Labone
UPDATE properties 
SET images = ARRAY[
  '/images/properties/labone-apt-1.jpg',
  '/images/properties/labone-apt-2.jpg',
  '/images/properties/labone-apt-3.jpg'
]
WHERE title = '3 Bedroom Apartment for Rent in Labone';

-- Property 9: 2 Bedroom House in Kasoa
UPDATE properties 
SET images = ARRAY[
  '/images/properties/kasoa-house-1.jpg',
  '/images/properties/kasoa-house-2.jpg',
  '/images/properties/kasoa-house-3.jpg'
]
WHERE title = '2 Bedroom House in Kasoa';

-- Property 10: 4 Bedroom Apartment in Trasacco Valley
UPDATE properties 
SET images = ARRAY[
  '/images/properties/trasacco-apt-1.jpg',
  '/images/properties/trasacco-apt-2.jpg',
  '/images/properties/trasacco-apt-3.jpg',
  '/images/properties/trasacco-apt-4.jpg'
]
WHERE title = '4 Bedroom Apartment in Trasacco Valley';

-- Property 11: 3 Bedroom House in Adenta
UPDATE properties 
SET images = ARRAY[
  '/images/properties/adenta-house-1.jpg',
  '/images/properties/adenta-house-2.jpg',
  '/images/properties/adenta-house-3.jpg'
]
WHERE title = '3 Bedroom House in Adenta';

-- Property 12: 5 Bedroom Executive House in Spintex
UPDATE properties 
SET images = ARRAY[
  '/images/properties/spintex-house-1.jpg',
  '/images/properties/spintex-house-2.jpg',
  '/images/properties/spintex-house-3.jpg',
  '/images/properties/spintex-house-4.jpg'
]
WHERE title = '5 Bedroom Executive House in Spintex';

-- Property 13: 2 Bedroom Apartment for Rent in Tema
UPDATE properties 
SET images = ARRAY[
  '/images/properties/tema-apt-1.jpg',
  '/images/properties/tema-apt-2.jpg',
  '/images/properties/tema-apt-3.jpg'
]
WHERE title = '2 Bedroom Apartment for Rent in Tema';

-- Property 14: 4 Bedroom House in Oyarifa
UPDATE properties 
SET images = ARRAY[
  '/images/properties/oyarifa-house-1.jpg',
  '/images/properties/oyarifa-house-2.jpg',
  '/images/properties/oyarifa-house-3.jpg'
]
WHERE title = '4 Bedroom House in Oyarifa';

-- Property 15: 3 Bedroom Apartment in Dzorwulu
UPDATE properties 
SET images = ARRAY[
  '/images/properties/dzorwulu-apt-1.jpg',
  '/images/properties/dzorwulu-apt-2.jpg',
  '/images/properties/dzorwulu-apt-3.jpg'
]
WHERE title = '3 Bedroom Apartment in Dzorwulu';

-- Property 16: 6 Bedroom Mansion in Roman Ridge
UPDATE properties 
SET images = ARRAY[
  '/images/properties/roman-ridge-mansion-1.jpg',
  '/images/properties/roman-ridge-mansion-2.jpg',
  '/images/properties/roman-ridge-mansion-3.jpg',
  '/images/properties/roman-ridge-mansion-4.jpg'
]
WHERE title = '6 Bedroom Mansion in Roman Ridge';

-- Property 17: 3 Bedroom House in Weija
UPDATE properties 
SET images = ARRAY[
  '/images/properties/weija-house-1.jpg',
  '/images/properties/weija-house-2.jpg',
  '/images/properties/weija-house-3.jpg'
]
WHERE title = '3 Bedroom House in Weija';

-- Property 18: 2 Bedroom Apartment in Dansoman
UPDATE properties 
SET images = ARRAY[
  '/images/properties/dansoman-apt-1.jpg',
  '/images/properties/dansoman-apt-2.jpg',
  '/images/properties/dansoman-apt-3.jpg'
]
WHERE title = '2 Bedroom Apartment in Dansoman';

-- Property 19: 4 Bedroom House for Rent in Achimota
UPDATE properties 
SET images = ARRAY[
  '/images/properties/achimota-house-1.jpg',
  '/images/properties/achimota-house-2.jpg',
  '/images/properties/achimota-house-3.jpg'
]
WHERE title = '4 Bedroom House for Rent in Achimota';

-- Property 20: 3 Bedroom Apartment in Legon
UPDATE properties 
SET images = ARRAY[
  '/images/properties/legon-apt-1.jpg',
  '/images/properties/legon-apt-2.jpg',
  '/images/properties/legon-apt-3.jpg'
]
WHERE title = '3 Bedroom Apartment in Legon';
