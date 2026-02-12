-- Insert Devtraco Woodlands Properties - Master-Planned Gated City
-- Location: Dawhenya, 1 min from Central University
-- Developer: Devtraco Group
-- Two Clusters Currently Selling: Orchid and Jute

-- 1. Orchid Cluster - Premium 80x70 Plot
INSERT INTO properties (
  title,
  description,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  property_type,
  listing_type,
  status,
  agent,
  phone,
  amenities,
  images,
  featured
) VALUES (
  'Devtraco Woodlands - Orchid Cluster (80ft x 70ft)',
  'Secure your place in Ghana''s premier master-planned gated city spanning 592 acres in Dawhenya. The Orchid Cluster offers premium 80ft x 70ft (5,600 sq ft) litigation-free plots with complimentary architectural plans and Bill of Quantities (BOQ). Located just 1 minute from Central University and 15 minutes from breathtaking beaches.

Key Features: Litigation-free title, free architectural plan & BOQ, tarred roads, street lighting, electrical power supply, Ghana Water connection, controlled access entry, enclosed gated cluster. Flexible payment plans available: 14 days to 12 months. Mortgage financing available.

Enjoy a self-sustaining community with modern infrastructure, 24/7 security, clubhouse, swimming pools, tennis courts, basketball court, football court, gym, medical center, and police/fire stations on-site. This is more than land ownership—it''s an investment in a vibrant, secure lifestyle where coastal calm meets city energy. 

Lease: 70 years (Ghanaians), 50 years (Non-Ghanaians).
Location: 1 min to Central University, 15 min to beaches, 20 min to Tema, 45 min to Airport.

Payment Plans: 14 Days, 3 Months, 6 Months, 12 Months available.
Contact: +233 540 10 7476',
  'Orchid Cluster, Devtraco Woodlands, Dawhenya, Accra',
  34000,
  0,
  0,
  5600,
  'Land',
  'sale',
  'active',
  'Devtraco Group',
  '+233 540 10 7476',
  ARRAY[
    '24hr Security',
    'Gated Community',
    'Clubhouse',
    'Swimming Pools',
    'Tennis Court',
    'Basketball Court',
    'Football Court',
    'Gym',
    'Playground',
    'Walking Trails',
    'Recreational Gardens',
    'Medical Center',
    'Retail Shops',
    'Police Station',
    'Fire Station',
    'Facility Management',
    'On-site Management',
    'Maintenance Teams'
  ],
  ARRAY[
    '/images/properties/devtraco-woodlands-cluster.jpg',
    '/images/properties/devtraco-woodlands-aerial-community.jpg',
    '/images/properties/devtraco-woodlands-masterplan-real.jpg',
    '/images/properties/devtraco-woodlands-entrance-real.jpg',
    '/images/properties/devtraco-woodlands-clubhouse-real.jpg'
  ],
  true
);

-- 2. Jute Cluster - Affordable 70x40 Plot
INSERT INTO properties (
  title,
  description,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  property_type,
  listing_type,
  status,
  agent,
  phone,
  amenities,
  images,
  featured
) VALUES (
  'Devtraco Woodlands - Jute Cluster (70ft x 40ft)',
  'Start your homeownership journey in Devtraco Woodlands, a 592-acre master-planned gated city in Dawhenya. The Jute Cluster offers affordable 70ft x 40ft (2,800 sq ft) litigation-free serviced plots with complimentary architectural plans and BOQ. Perfect for first-time buyers or investors seeking value.

Key Features: Litigation-free title, free architectural plan & BOQ, affordable entry price, tarred roads, street lighting, electrical power supply, Ghana Water connection, controlled access entry, enclosed gated cluster. Flexible payment plans available: 14 days to 12 months. Mortgage financing available.

Enjoy all the amenities of a world-class community: 24/7 security, clubhouse, swimming pools, sports facilities, gym, medical center, and more. Benefit from meticulously planned infrastructure. Build your dream home with peace of mind in a secure, family-friendly environment.

Lease: 70 years (Ghanaians), 50 years (Non-Ghanaians).
Location: 1 min to Central University, 15 min to beaches, 20 min to Tema, 45 min to Airport.

Payment Plans: 14 Days, 3 Months, 6 Months, 12 Months available.
Contact: +233 540 10 7476',
  'Jute Cluster, Devtraco Woodlands, Dawhenya, Accra',
  17500,
  0,
  0,
  2800,
  'Land',
  'sale',
  'active',
  'Devtraco Group',
  '+233 540 10 7476',
  ARRAY[
    '24hr Security',
    'Gated Community',
    'Clubhouse',
    'Swimming Pools',
    'Tennis Court',
    'Basketball Court',
    'Football Court',
    'Gym',
    'Playground',
    'Walking Trails',
    'Recreational Gardens',
    'Medical Center',
    'Retail Shops',
    'Police Station',
    'Fire Station',
    'Facility Management',
    'On-site Management',
    'Maintenance Teams'
  ],
  ARRAY[
    '/images/properties/devtraco-woodlands-cluster-triangle.jpg',
    '/images/properties/devtraco-woodlands-aerial-community.jpg',
    '/images/properties/devtraco-woodlands-masterplan-real.jpg',
    '/images/properties/devtraco-woodlands-entrance-real.jpg',
    '/images/properties/devtraco-woodlands-facility.jpg'
  ],
  true
);

-- Verification query
SELECT 
  id,
  title,
  location,
  price,
  area,
  property_type,
  agent,
  featured,
  status
FROM properties
WHERE agent = 'Devtraco Group'
ORDER BY price DESC;
