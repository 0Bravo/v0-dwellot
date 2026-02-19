-- Insert Trasacco Properties listings
INSERT INTO properties (title, description, property_type, listing_type, price, currency, location, address, region, bedrooms, bathrooms, amenities, status, agent, agent_name, agent_phone, agent_email, agent_company, developer, estate_name, phone, agent_whatsapp, created_at, updated_at)
VALUES
(
  'Akaya 2-Bedroom Apartment',
  'Modern 2-bedroom apartment in master-planned estate with private gardens or roof terraces. Phase One opening February 2026. 28-acre estate with 74 homes in Phase 1. Construction by Micheletti & Co. Features include private garden (120sqm ground floor) or roof terrace (37-48.5sqm), modern architecture, and Trasacco warranty.',
  'apartment', 'sale', 185500, 'USD',
  'Pantang', 'Pantang Abokobi Road, Greater Accra', 'Greater Accra',
  2, 2,
  '{"Clubhouse","Swimming Pool","Gym","Padel Tennis Court","Multi-sport Court","Children''s Playground","Private Theatre","Board Rooms","Event Space","24/7 Security"}',
  'inactive',
  'Trasacco Properties', 'Melissa Frank', '+233 53 639 3787', 'sales@trasaccopark.com', 'Trasacco Properties',
  'Trasacco Properties Ltd', 'Akaya by Trasacco',
  '+233 53 639 3787', '+233 53 639 3787',
  NOW(), NOW()
),
(
  'Akaya 3-Bedroom Townhome',
  'Semi-detached 3-bedroom townhome with 50% more garden space than competitors. Modern design with contemporary facades and high-quality finishes. Construction-linked payment plan available. Managed by Trasacco for long-term value retention.',
  'townhouse', 'sale', 225000, 'USD',
  'Pantang', 'Pantang Abokobi Road, Greater Accra', 'Greater Accra',
  3, 3,
  '{"Clubhouse","Swimming Pool","Gym","Padel Tennis Court","Multi-sport Court","Children''s Playground","Private Theatre","Central Green Park","24/7 Security"}',
  'inactive',
  'Trasacco Properties', 'Melissa Frank', '+233 53 639 3787', 'sales@trasaccopark.com', 'Trasacco Properties',
  'Trasacco Properties Ltd', 'Akaya by Trasacco',
  '+233 53 639 3787', '+233 53 639 3787',
  NOW(), NOW()
),
(
  'Akaya 4-Bedroom Townhome',
  'Exclusive 4-bedroom townhome designed for family living with modern architecture and interiors. Premium finishes throughout. Trasacco warranty included. 8 mins to Oyarifa Mall. 10 mins to University of Ghana.',
  'townhouse', 'sale', 295000, 'USD',
  'Pantang', 'Pantang Abokobi Road, Greater Accra', 'Greater Accra',
  4, 4,
  '{"Clubhouse","Swimming Pool","Gym","Padel Tennis Court","Multi-sport Court","Children''s Playground","Private Theatre","Central Green Park","24/7 Security"}',
  'inactive',
  'Trasacco Properties', 'Melissa Frank', '+233 53 639 3787', 'sales@trasaccopark.com', 'Trasacco Properties',
  'Trasacco Properties Ltd', 'Akaya by Trasacco',
  '+233 53 639 3787', '+233 53 639 3787',
  NOW(), NOW()
),
(
  'Trasacco Park 3-Bedroom Home',
  'Quality 3-bedroom home at affordable price in fast-growing Pantang area. Designed for comfort and convenience with modern infrastructure. Strong rental demand in area. 20 mins to KIA. 8 mins to Oyarifa Mall. Property appreciation 5%+ annually.',
  'house', 'sale', 150000, 'USD',
  'Adenta', 'Pantang Abokobi Rd, Adenta, Greater Accra', 'Greater Accra',
  3, 3,
  '{"Green Spaces","Modern Infrastructure","Community Amenities","24/7 Security"}',
  'inactive',
  'Trasacco Properties', 'Trasacco Properties', '+233 53 639 3787', 'sales@trasaccopark.com', 'Trasacco Properties',
  'Trasacco Properties Ltd', 'Trasacco Park',
  '+233 53 639 3787', '+233 53 639 3787',
  NOW(), NOW()
),
(
  'Trasacco Valley 4-Bedroom House',
  'Standard 4-bedroom house in prestigious Trasacco Valley estate with world-class amenities. Home to celebrities and business leaders. Premium address in Ghana with tarred roads, proximity to KIA, and near schools and shops.',
  'house', 'sale', 500000, 'USD',
  'East Legon', 'Trasacco Valley Estate, East Legon, Greater Accra', 'Greater Accra',
  4, 4,
  '{"Golf Course","Tennis Courts","Parks","24/7 Security","Gated Community"}',
  'inactive',
  'Trasacco Properties', 'Trasacco Estates', '030 701 2332', 'info@trasaccovalley.com', 'Trasacco Estates Development Company',
  'Trasacco Estates Development Company Ltd', 'Trasacco Valley',
  '030 701 2332', '+233 53 639 3787',
  NOW(), NOW()
),
(
  'Trasacco Valley 6-Bedroom Mansion',
  'Luxury 6-bedroom mansion in Ghana''s most prestigious residential estate. 600-acre estate near Spintex Road and Accra-Tema Motorway. Premium finishing, expansive gardens, staff quarters, and swimming pool potential.',
  'house', 'sale', 1000000, 'USD',
  'East Legon', 'Trasacco Valley Estate, East Legon, Greater Accra', 'Greater Accra',
  6, 6,
  '{"Golf Course","Tennis Courts","Parks","24/7 Security","Gated Community"}',
  'inactive',
  'Trasacco Properties', 'Trasacco Estates', '030 701 2332', 'info@trasaccovalley.com', 'Trasacco Estates Development Company',
  'Trasacco Estates Development Company Ltd', 'Trasacco Valley',
  '030 701 2332', '+233 53 639 3787',
  NOW(), NOW()
);
