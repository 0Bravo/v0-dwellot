-- Template for inserting your properties into the database
-- Copy this template for each property you want to add
-- Replace the placeholder values with your actual property data

-- Example Property 1
INSERT INTO properties (
  title,
  description,
  price,
  location,
  property_type,
  listing_type,
  bedrooms,
  bathrooms,
  area,
  parking,
  amenities,
  featured,
  status,
  agent,
  phone,
  images
) VALUES (
  'YOUR PROPERTY TITLE HERE',
  'YOUR DETAILED DESCRIPTION HERE. Include key features, condition, and unique selling points.',
  0, -- Replace with price in GHS (numbers only, no commas)
  'NEIGHBORHOOD, CITY', -- e.g., 'East Legon, Accra'
  'PROPERTY_TYPE', -- Options: House, Apartment, Villa, Townhouse, Land, Commercial
  'LISTING_TYPE', -- Options: sale, rent
  0, -- Number of bedrooms
  0, -- Number of bathrooms
  0, -- Area in square meters
  0, -- Number of parking spaces (use 0 if none)
  ARRAY['AMENITY1', 'AMENITY2', 'AMENITY3'], -- e.g., ARRAY['Swimming Pool', 'Security', 'Garden']
  false, -- Featured property? true or false
  'active', -- Status: active, pending, sold, rented, inactive
  'AGENT NAME', -- Optional: Name of listing agent
  '+233 XX XXX XXXX', -- Optional: Agent phone number
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ]
);

-- Example Property 2 (Copy and modify for additional properties)
INSERT INTO properties (
  title,
  description,
  price,
  location,
  property_type,
  listing_type,
  bedrooms,
  bathrooms,
  area,
  parking,
  amenities,
  featured,
  status,
  agent,
  phone,
  images
) VALUES (
  'YOUR SECOND PROPERTY TITLE HERE',
  'YOUR SECOND PROPERTY DESCRIPTION HERE.',
  0,
  'LOCATION',
  'PROPERTY_TYPE',
  'LISTING_TYPE',
  0,
  0,
  0,
  0,
  ARRAY['AMENITY1', 'AMENITY2'],
  false,
  'active',
  'AGENT NAME',
  '+233 XX XXX XXXX',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ]
);

-- Add more properties by copying the INSERT statement above
