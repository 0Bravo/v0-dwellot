-- Clear existing properties and add comprehensive Appolonia City properties
-- Each property has multiple real images for carousel functionality

-- Clear existing properties
TRUNCATE TABLE properties RESTART IDENTITY CASCADE;

-- Insert Nova Ridge Properties
INSERT INTO properties (
  title, description, price, location, bedrooms, bathrooms, area, property_type, 
  listing_type, status, featured, images, amenities, agent, phone
) VALUES
-- Nova Ridge Standard Plot
(
  'Nova Ridge - Standard Serviced Plot',
  'Premium 80ft x 50ft serviced plot in Nova Ridge, Appolonia City''s exclusive gated community. This plot comes with clean land title, excellent infrastructure including good roads, drainage, on-site electricity, running water, and state-of-the-art ICT networking. Located in a secure environment with 24-hour security and access to world-class amenities.',
  33965.30,
  'Nova Ridge, Appolonia City, Accra',
  0, 0, 4000,
  'Land',
  'sale',
  'active',
  true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Aerial-View.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Gate.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Roads.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Amenities.jpg'
  ],
  ARRAY['Gated Community', '24hr Security', 'Good Roads', 'Drainage System', 'Electricity', 'Running Water', 'ICT Networking', 'Clubhouse', 'Jogging Trail', 'Biking Trail'],
  'Appolonia City Sales',
  '+233 302 740 707'
),

-- The Oxford - Walton 2 Bedroom
(
  'The Oxford - Walton 2 Bedroom Semi-Detached',
  'Modern 2-bedroom expandable semi-detached home in The Oxford community. Features contemporary hidden roof design, plasterboard ceilings, en-suite master bedroom, visitor''s washroom, kitchen with pantry and quartz worktop. Set on a 45ft x 70ft landscaped plot with parking for 3 cars. Includes air-condition & water heater preparation, UPVC casement windows, and panic alarm system.',
  99750,
  'The Oxford, Appolonia City, Accra',
  2, 2, 1200,
  'Semi-Detached',
  'sale',
  'active',
  true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Exterior.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Living-Room.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Kitchen.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Bedroom.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Bathroom.jpg'
  ],
  ARRAY['En-suite Master', 'Visitor Washroom', 'Quartz Worktop', 'AC Preparation', 'Water Heater Prep', 'UPVC Windows', 'Panic Alarm', 'Landscaped Plot', '3 Car Parking', 'Hidden Roof Design'],
  'Appolonia City Sales',
  '+233 302 740 707'
),

-- The Oxford - Walton 3 Bedroom
(
  'The Oxford - Walton 3 Bedroom Semi-Detached',
  'Spacious 3-bedroom semi-detached home in The Oxford estate. This turnkey home features contemporary architecture with hidden roof design, plasterboard ceilings, en-suite master bedroom, and modern kitchen with quartz worktop. Located on a 45ft x 70ft landscaped plot with ample parking for 3 vehicles. Perfect for growing families seeking quality and comfort.',
  110250,
  'The Oxford, Appolonia City, Accra',
  3, 3, 1400,
  'Semi-Detached',
  'sale',
  'active',
  true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Exterior.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Living.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Kitchen.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Master.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3BR-Garden.jpg'
  ],
  ARRAY['3 Bedrooms', 'En-suite Master', 'Visitor Washroom', 'Modern Kitchen', 'Quartz Worktop', 'AC Preparation', 'UPVC Windows', 'Panic Alarm', 'Landscaped Garden', '3 Car Parking'],
  'Appolonia City Sales',
  '+233 302 740 707'
),

-- The Oxford - Eaton 3 Bedroom
(
  'The Oxford - Eaton 3 Bedroom Detached',
  'Elegant 3-bedroom detached home in The Oxford community. This premium property sits on a generous 50ft x 70ft landscaped plot with parking for 3 cars. Features include contemporary hidden roof design, plasterboard ceilings, en-suite master bedroom, visitor''s washroom, and a well-appointed kitchen with pantry area and quartz worktop. Complete with air-condition & water heater preparation, UPVC casement windows, and panic alarm system.',
  131250,
  'The Oxford, Appolonia City, Accra',
  3, 3, 1600,
  'Detached',
  'sale',
  'active',
  true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Exterior.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Living-Room.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Dining.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Kitchen.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Master-Bedroom.jpg'
  ],
  ARRAY['Detached Home', 'En-suite Master', 'Visitor Washroom', 'Kitchen Pantry', 'Quartz Worktop', 'AC Preparation', 'Water Heater Prep', 'UPVC Windows', 'Panic Alarm', 'Large Plot', '3 Car Parking'],
  'Appolonia City Sales',
  '+233 302 740 707'
),

-- The Oxford - Barton 4 Bedroom
(
  'The Oxford - Barton 4 Bedroom Townhouse',
  'Luxurious 4-bedroom two-storey townhouse in The Oxford estate. With 165 sqm (1,776 sqft) of built area, this modern home features contemporary hidden roof design, plasterboard ceilings, en-suite bedrooms, and a visitor''s washroom. The kitchen boasts a pantry area and quartz worktop. All rooms come with air-conditioning units. Set on a landscaped plot with parking for 3 cars, complete with UPVC casement windows and panic alarm system.',
  192938,
  'The Oxford, Appolonia City, Accra',
  4, 4, 1776,
  'Townhouse',
  'sale',
  'active',
  true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Exterior.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Living.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Kitchen.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Master.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Balcony.jpg'
  ],
  ARRAY['4 Bedrooms', 'All En-suite', 'Visitor Washroom', 'Kitchen Pantry', 'Quartz Worktop', 'AC in All Rooms', 'UPVC Windows', 'Panic Alarm', 'Two Storey', 'Landscaped Plot', '3 Car Parking'],
  'Appolonia City Sales',
  '+233 302 740 707'
);

-- Verify the inserts
SELECT 
  id,
  title,
  price,
  bedrooms,
  bathrooms,
  property_type,
  array_length(images, 1) as image_count,
  featured
FROM properties
ORDER BY price;

-- Summary
SELECT 
  COUNT(*) as total_properties,
  COUNT(*) FILTER (WHERE featured = true) as featured_properties,
  SUM(CASE WHEN array_length(images, 1) >= 3 THEN 1 ELSE 0 END) as properties_with_multiple_images
FROM properties;
