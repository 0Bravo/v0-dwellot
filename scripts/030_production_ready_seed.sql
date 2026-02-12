-- Clean up existing properties to ensure a fresh start
DELETE FROM properties;

-- Reset the sequence
ALTER SEQUENCE properties_id_seq RESTART WITH 1;

-- 1. Nova Ridge - Standard Serviced Plot
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'Nova Ridge - Standard Serviced Plot (80ft x 50ft)',
  'Prime serviced plot in Nova Ridge, Appolonia City''s premier gated residential community. This 80ft x 50ft plot comes with clean land title, excellent infrastructure including good roads, drainage, on-site electricity, running water, state-of-the-art ICT networking, and excellent security systems. Located in a well-planned neighborhood with access to clubhouse, 24-hour security gatehouse, and jogging & biking trails.',
  'Nova Ridge, Appolonia City, Accra',
  33965,
  'Land',
  'sale',
  0, 0, 372, 0,
  ARRAY[
    '/images/properties/realistic/nova-ridge-plot.jpg',
    '/images/properties/realistic/nova-ridge-gate.jpg',
    '/images/properties/realistic/nova-ridge-amenities.jpg'
  ],
  ARRAY[
    'Clean Land Title',
    'Gated Community',
    'Good Roads',
    'Drainage System',
    'On-site Electricity',
    'Running Water',
    '24-Hour Security',
    'Clubhouse Access'
  ],
  true, 'active', 'Appolonia City', '+233 302 967150'
);

-- 2. Nova Ridge - Corner Plot
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'Nova Ridge - Premium Corner Plot (100ft x 70ft)',
  'Exclusive corner plot in Nova Ridge offering enhanced privacy and space. This premium 100ft x 70ft plot provides excellent visibility and accessibility with dual street frontage. Comes with all Nova Ridge amenities including serviced infrastructure, security, and community facilities. Ideal for building a larger family home or investment property.',
  'Nova Ridge, Appolonia City, Accra',
  52000,
  'Land',
  'sale',
  0, 0, 650, 0,
  ARRAY[
    '/images/properties/realistic/nova-ridge-plot.jpg',
    '/images/properties/realistic/nova-ridge-gate.jpg',
    '/images/properties/realistic/nova-ridge-amenities.jpg'
  ],
  ARRAY[
    'Corner Plot',
    'Dual Street Frontage',
    'Clean Land Title',
    'Gated Community',
    'Premium Location',
    'All Infrastructure Included',
    '24-Hour Security'
  ],
  true, 'active', 'Appolonia City', '+233 302 967150'
);

-- 3. The Oxford - Walton 2 Bedroom
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'The Oxford - Walton 2 Bedroom Semi-Detached',
  'Modern 2-bedroom expandable semi-detached home in The Oxford residential estate. Features contemporary hidden roof design, plasterboard ceilings, en-suite master bedroom, visitor''s washroom, and kitchen with pantry area and quartz worktop. Set on a 45ft x 70ft landscaped plot with parking for 3 cars.',
  'The Oxford, Appolonia City, Accra',
  99750,
  'House',
  'sale',
  2, 2, 93, 3,
  ARRAY[
    '/images/properties/realistic/oxford-walton-ext.jpg',
    '/images/properties/realistic/oxford-walton-int.jpg',
    '/images/properties/realistic/oxford-eaton-kitchen.jpg',
    '/images/properties/realistic/oxford-barton-bedroom.jpg'
  ],
  ARRAY[
    'Turnkey Home',
    'Contemporary Design',
    'Hidden Roof',
    'En-suite Master Bedroom',
    'Visitor Washroom',
    'Quartz Kitchen Worktop',
    'Landscaped Plot',
    '3-Car Parking'
  ],
  true, 'active', 'Appolonia City', '+233 302 967150'
);

-- 4. The Oxford - Walton 3 Bedroom
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'The Oxford - Walton 3 Bedroom Semi-Detached',
  'Spacious 3-bedroom semi-detached home in The Oxford estate. This turnkey property features contemporary hidden roof design, plasterboard ceilings, en-suite master bedroom, visitor''s washroom, and modern kitchen with quartz worktop and pantry. Located on a 45ft x 70ft landscaped plot with ample parking for 3 cars.',
  'The Oxford, Appolonia City, Accra',
  110250,
  'House',
  'sale',
  3, 2, 111, 3,
  ARRAY[
    '/images/properties/realistic/oxford-walton-ext.jpg',
    '/images/properties/realistic/oxford-walton-int.jpg',
    '/images/properties/realistic/oxford-eaton-kitchen.jpg',
    '/images/properties/realistic/oxford-barton-bedroom.jpg'
  ],
  ARRAY[
    'Turnkey Home',
    '3 Bedrooms',
    'Contemporary Design',
    'En-suite Master',
    'Visitor Washroom',
    'Quartz Worktop',
    'Modern Kitchen',
    'Landscaped Garden',
    '3-Car Parking'
  ],
  true, 'active', 'Appolonia City', '+233 302 967150'
);

-- 5. The Oxford - Eaton 3 Bedroom Detached
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'The Oxford - Eaton 3 Bedroom Detached Home',
  'Elegant 3-bedroom detached home in The Oxford residential estate. This premium turnkey property sits on a generous 50ft x 70ft landscaped plot and features contemporary hidden roof design, plasterboard ceilings, en-suite master bedroom, visitor''s washroom, and gourmet kitchen with quartz worktop and pantry area.',
  'The Oxford, Appolonia City, Accra',
  131250,
  'House',
  'sale',
  3, 2, 130, 3,
  ARRAY[
    '/images/properties/realistic/oxford-eaton-ext.jpg',
    '/images/properties/realistic/oxford-walton-int.jpg',
    '/images/properties/realistic/oxford-eaton-kitchen.jpg',
    '/images/properties/realistic/oxford-barton-bedroom.jpg'
  ],
  ARRAY[
    'Detached Home',
    'Turnkey Property',
    'Contemporary Design',
    'En-suite Master',
    'Visitor Washroom',
    'Gourmet Kitchen',
    'Quartz Worktop',
    'Landscaped Plot',
    '3-Car Parking'
  ],
  false, 'active', 'Appolonia City', '+233 302 967150'
);

-- 6. The Oxford - Barton 4 Bedroom Townhouse
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'The Oxford - Barton 4 Bedroom Townhouse',
  'Luxurious 4-bedroom two-storey modern townhouse in The Oxford estate. This premium 165 sqm turnkey home features contemporary hidden roof design, plasterboard ceilings, all en-suite bedrooms, visitor''s washroom, and state-of-the-art kitchen with quartz worktop and pantry. Set on a beautifully landscaped plot.',
  'The Oxford, Appolonia City, Accra',
  192938,
  'Townhouse',
  'sale',
  4, 4, 165, 3,
  ARRAY[
    '/images/properties/realistic/oxford-barton-ext.jpg',
    '/images/properties/realistic/oxford-walton-int.jpg',
    '/images/properties/realistic/oxford-eaton-kitchen.jpg',
    '/images/properties/realistic/oxford-barton-bedroom.jpg'
  ],
  ARRAY[
    '4 Bedroom Townhouse',
    'Two-Storey Design',
    'All En-suite Bedrooms',
    'Contemporary Design',
    'Visitor Washroom',
    'Modern Kitchen',
    'Quartz Worktop',
    'Landscaped Plot',
    '3-Car Parking'
  ],
  false, 'active', 'Appolonia City', '+233 302 967150'
);

-- 7. Appolonia Mews - 3 Bedroom Townhouse
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'Appolonia Mews - 3 Bedroom Townhouse',
  'Contemporary 3-bedroom townhouse in Appolonia Mews residential development. This modern home features open-plan living spaces, en-suite master bedroom, guest bathroom, and fully fitted kitchen. Set within a secure gated community with excellent amenities including swimming pool, gym, and children''s play area.',
  'Appolonia Mews, Appolonia City, Accra',
  145000,
  'Townhouse',
  'sale',
  3, 2, 140, 2,
  ARRAY[
    '/images/properties/realistic/mews-townhouse-ext.jpg',
    '/images/properties/realistic/mews-interior.jpg',
    '/images/properties/realistic/oxford-eaton-kitchen.jpg',
    '/images/properties/realistic/oxford-barton-bedroom.jpg'
  ],
  ARRAY[
    'Gated Community',
    'Swimming Pool',
    'Gym Facility',
    'Children Play Area',
    'Open-Plan Living',
    'En-suite Master',
    'Fitted Kitchen',
    '24-Hour Security',
    '2-Car Parking'
  ],
  false, 'active', 'Appolonia City', '+233 302 967150'
);

-- 8. Appolonia Mews - 4 Bedroom Detached
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'Appolonia Mews - 4 Bedroom Detached Villa',
  'Spacious 4-bedroom detached villa in Appolonia Mews. This premium home offers generous living spaces, all en-suite bedrooms, modern kitchen, and private garden. Located in a secure gated community with resort-style amenities including swimming pool, gym, tennis courts, and clubhouse.',
  'Appolonia Mews, Appolonia City, Accra',
  185000,
  'House',
  'sale',
  4, 4, 200, 3,
  ARRAY[
    '/images/properties/realistic/mews-villa-ext.jpg',
    '/images/properties/realistic/mews-interior.jpg',
    '/images/properties/realistic/oxford-eaton-kitchen.jpg',
    '/images/properties/realistic/oxford-barton-bedroom.jpg'
  ],
  ARRAY[
    'Detached Villa',
    'Gated Community',
    'All En-suite',
    'Private Garden',
    'Swimming Pool',
    'Gym',
    'Tennis Courts',
    'Clubhouse',
    '24-Hour Security',
    '3-Car Parking'
  ],
  false, 'active', 'Appolonia City', '+233 302 967150'
);

-- 9. Appolonia Industrial Park - Warehouse Unit
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'Appolonia Industrial Park - Warehouse Unit (500 sqm)',
  'Modern warehouse unit in Appolonia Industrial Park, Ghana''s premier logistics and warehousing hub. This 500 sqm facility features high ceilings, loading bay, office space, and excellent road access. Located within a secure industrial park with 24-hour security, backup power, and proximity to major highways.',
  'Appolonia Industrial Park, Appolonia City',
  250000,
  'Commercial',
  'sale',
  0, 2, 500, 10,
  ARRAY[
    '/images/properties/realistic/industrial-park.jpg',
    '/images/properties/realistic/industrial-warehouse-int.jpg',
    '/images/properties/realistic/industrial-retail.jpg'
  ],
  ARRAY[
    'Warehouse Space',
    'High Ceilings',
    'Loading Bay',
    'Office Space',
    'Secure Industrial Park',
    '24-Hour Security',
    'Backup Power',
    'Highway Access',
    'Ample Parking'
  ],
  false, 'active', 'Appolonia City', '+233 302 967150'
);

-- 10. Appolonia Industrial Park - Large Warehouse
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'Appolonia Industrial Park - Large Warehouse (1000 sqm)',
  'Expansive 1000 sqm warehouse facility in Appolonia Industrial Park. Features include high-bay storage, multiple loading docks, administrative offices, and excellent logistics infrastructure. Perfect for large-scale distribution, manufacturing, or storage operations.',
  'Appolonia Industrial Park, Appolonia City',
  450000,
  'Commercial',
  'sale',
  0, 3, 1000, 20,
  ARRAY[
    '/images/properties/realistic/industrial-park.jpg',
    '/images/properties/realistic/industrial-warehouse-int.jpg',
    '/images/properties/realistic/industrial-retail.jpg'
  ],
  ARRAY[
    'Large Warehouse',
    'High-Bay Storage',
    'Multiple Loading Docks',
    'Administrative Offices',
    'Secure Park',
    '24-Hour Security',
    'Backup Generator',
    'Highway Access',
    'Ample Parking'
  ],
  false, 'active', 'Appolonia City', '+233 302 967150'
);

-- 11. Appolonia Industrial Park - Retail Space
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'Appolonia Industrial Park - Retail/Showroom Space',
  'Prime retail and showroom space in Appolonia Industrial Park. This 300 sqm unit features modern design, high visibility, ample parking, and excellent foot traffic. Perfect for automotive showrooms, furniture stores, or retail operations.',
  'Appolonia Industrial Park, Appolonia City',
  180000,
  'Commercial',
  'sale',
  0, 2, 300, 15,
  ARRAY[
    '/images/properties/realistic/industrial-retail.jpg',
    '/images/properties/realistic/industrial-park.jpg',
    '/images/properties/realistic/industrial-warehouse-int.jpg'
  ],
  ARRAY[
    'Retail Space',
    'Showroom',
    'High Visibility',
    'Modern Design',
    'Ample Parking',
    'High Foot Traffic',
    '24-Hour Security',
    'Excellent Access'
  ],
  false, 'active', 'Appolonia City', '+233 302 967150'
);

-- 12. Grade A Office Space
INSERT INTO properties (
  title, description, location, price, property_type, listing_type,
  bedrooms, bathrooms, area, parking, images, amenities, featured, status, agent, phone
) VALUES (
  'Appolonia City - Grade A Office Space (200 sqm)',
  'Premium Grade A office space in Appolonia City''s commercial district. This 200 sqm modern office features open-plan layout, meeting rooms, executive offices, and state-of-the-art facilities. Includes backup power, high-speed internet, central AC, and secure parking.',
  'Appolonia City Commercial District, Accra',
  320000,
  'Commercial',
  'sale',
  0, 3, 200, 10,
  ARRAY[
    '/images/properties/realistic/office-building.jpg',
    '/images/properties/realistic/office-interior.jpg',
    '/images/properties/realistic/nova-ridge-amenities.jpg'
  ],
  ARRAY[
    'Grade A Office',
    'Open-Plan Layout',
    'Meeting Rooms',
    'Executive Offices',
    'Backup Power',
    'High-Speed Internet',
    'Central AC',
    'Secure Parking',
    '24-Hour Security'
  ],
  false, 'active', 'Appolonia City', '+233 302 967150'
);
