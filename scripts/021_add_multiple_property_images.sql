-- Clear existing properties and add comprehensive Appolonia properties with multiple images
DELETE FROM properties;

-- Nova Ridge - Standard Serviced Plot
INSERT INTO properties (
  title, description, price, location, property_type, listing_type,
  bedrooms, bathrooms, area, parking, status, featured,
  images, amenities, agent, phone
) VALUES (
  'Nova Ridge - Standard Serviced Plot',
  'Premium 80ft x 50ft serviced plot in Nova Ridge, a gated residential community within Appolonia City. This plot comes with excellent infrastructure including good roads, drainage, on-site electricity, running water, state-of-the-art ICT networking, and excellent security systems. Buyers can choose from four modern house designs to build their dream home.',
  33965.30,
  'Nova Ridge, Appolonia City, Accra',
  'Land',
  'For Sale',
  0, 0, 4000, 3,
  'active', true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Aerial-View.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Gate.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Roads.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Nova-Ridge-Amenities.jpg'
  ],
  ARRAY['Gated Community', '24/7 Security', 'Paved Roads', 'Drainage System', 'Electricity', 'Water Supply', 'ICT Networking', 'Clubhouse', 'Jogging Trail', 'Biking Trail'],
  'Dwellot Estates',
  '+233 24 123 4567'
);

-- The Oxford - Walton 2 Bedroom
INSERT INTO properties (
  title, description, price, location, property_type, listing_type,
  bedrooms, bathrooms, area, parking, status, featured,
  images, amenities, agent, phone
) VALUES (
  'The Oxford - Walton 2 Bedroom Semi-Detached',
  'Modern 2-bedroom semi-detached home in The Oxford community. Features contemporary hidden roof design, plasterboard ceilings, en-suite master bedroom, visitor washroom, kitchen with pantry and quartz worktop. Located on a 45ft x 70ft landscaped plot with parking for 3 cars. Part of a self-sustaining urban community with excellent amenities.',
  99750.00,
  'The Oxford, Appolonia City, Accra',
  'House',
  'For Sale',
  2, 2, 1200, 3,
  'active', true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Exterior.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Living-Room.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Kitchen.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Bedroom.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Oxford-Community.jpg'
  ],
  ARRAY['En-suite Master Bedroom', 'Visitor Washroom', 'Modern Kitchen', 'Quartz Worktop', 'Plasterboard Ceilings', 'UPVC Windows', 'Panic Alarm', 'AC Preparation', 'Water Heater Prep', 'Landscaped Plot', 'Parking for 3'],
  'Dwellot Estates',
  '+233 24 123 4567'
);

-- The Oxford - Walton 3 Bedroom
INSERT INTO properties (
  title, description, price, location, property_type, listing_type,
  bedrooms, bathrooms, area, parking, status, featured,
  images, amenities, agent, phone
) VALUES (
  'The Oxford - Walton 3 Bedroom Semi-Detached',
  'Spacious 3-bedroom semi-detached home in The Oxford estate. Features contemporary design with hidden roof, plasterboard ceilings, en-suite master bedroom, visitor washroom, and modern kitchen with quartz worktop. Set on a 45ft x 70ft landscaped plot with ample parking. Perfect for growing families seeking modern urban living.',
  110250.00,
  'The Oxford, Appolonia City, Accra',
  'House',
  'For Sale',
  3, 3, 1400, 3,
  'active', true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3bed-Exterior.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-3bed-Interior.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Master-Bedroom.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Walton-Bathroom.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Oxford-Amenities.jpg'
  ],
  ARRAY['3 Bedrooms', 'En-suite Master', 'Visitor Washroom', 'Modern Kitchen', 'Quartz Worktop', 'Plasterboard Ceilings', 'UPVC Windows', 'Panic Alarm', 'AC Preparation', 'Landscaped Plot', 'Parking for 3'],
  'Dwellot Estates',
  '+233 24 123 4567'
);

-- The Oxford - Eaton 3 Bedroom Detached
INSERT INTO properties (
  title, description, price, location, property_type, listing_type,
  bedrooms, bathrooms, area, parking, status, featured,
  images, amenities, agent, phone
) VALUES (
  'The Oxford - Eaton 3 Bedroom Detached',
  'Elegant 3-bedroom detached home in The Oxford community. Features contemporary hidden roof design, spacious living areas, en-suite master bedroom, visitor washroom, and premium kitchen with quartz worktop. Located on a generous 50ft x 70ft landscaped plot with parking for 3 cars. Ideal for families seeking privacy and modern comfort.',
  131250.00,
  'The Oxford, Appolonia City, Accra',
  'House',
  'For Sale',
  3, 3, 1600, 3,
  'active', true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Exterior.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Living-Area.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Kitchen.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Master-Suite.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Eaton-Garden.jpg'
  ],
  ARRAY['Detached Home', '3 Bedrooms', 'En-suite Master', 'Visitor Washroom', 'Premium Kitchen', 'Quartz Worktop', 'Plasterboard Ceilings', 'UPVC Windows', 'Panic Alarm', 'AC Preparation', 'Large Plot', 'Parking for 3'],
  'Dwellot Estates',
  '+233 24 123 4567'
);

-- The Oxford - Barton 4 Bedroom Townhouse
INSERT INTO properties (
  title, description, price, location, property_type, listing_type,
  bedrooms, bathrooms, area, parking, status, featured,
  images, amenities, agent, phone
) VALUES (
  'The Oxford - Barton 4 Bedroom Townhouse',
  'Luxurious 4-bedroom two-storey townhouse in The Oxford estate. Built area of 165 sqm (1,776 sqft) featuring contemporary hidden roof design, plasterboard ceilings, all en-suite bedrooms, visitor washroom, and modern kitchen with quartz worktop. Air-conditioning units in all rooms. Set on a landscaped plot with parking for 3 cars. Perfect for large families.',
  192938.00,
  'The Oxford, Appolonia City, Accra',
  'Townhouse',
  'For Sale',
  4, 4, 1776, 3,
  'active', true,
  ARRAY[
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Exterior.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Living-Room.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Kitchen.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Master-Bedroom.jpg',
    'https://www.appolonia.com.gh/wp-content/uploads/2020/04/Barton-Balcony.jpg'
  ],
  ARRAY['4 Bedrooms', 'All En-suite', 'Two-Storey', 'Visitor Washroom', 'Modern Kitchen', 'Quartz Worktop', 'Full AC', 'Plasterboard Ceilings', 'UPVC Windows', 'Panic Alarm', 'Landscaped Plot', 'Parking for 3'],
  'Dwellot Estates',
  '+233 24 123 4567'
);

-- Verify the update
SELECT 
  id,
  title,
  price,
  array_length(images, 1) as image_count,
  featured
FROM properties
ORDER BY id;
