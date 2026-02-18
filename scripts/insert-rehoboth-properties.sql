-- Insert Rehoboth Properties Ltd listings (12 properties, status = inactive, agent = Rehoboth Properties)

INSERT INTO properties (title, description, property_type, listing_type, price, currency, location, address, region, bedrooms, bathrooms, amenities, status, agent, agent_name, agent_phone, agent_email, agent_company, developer, estate_name, phone, agent_whatsapp, notes, created_at, updated_at)
VALUES
(
  'Rehoboth Knightsbridge 1-Bedroom',
  'EDGE-certified 1-bedroom apartment in Africa''s first affordable luxury housing community.',
  'apartment', 'sale', 30800, 'USD', 'Kwabenya', 'Kwabenya, Greater Accra', 'Greater Accra',
  1, 1,
  ARRAY['Swimming Pool','Basketball Court','Tennis Court','Gym','Spa','Sauna','Clinic','Creche','Shopping Mall','Pharmacy','24/7 Security'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 774 585', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Knightsbridge',
  '+233 263 774 585', '+233 263 774 585',
  '1700-1760 apartments. Best Developer Award 2016 & 2018. Phase 3 available. EDGE Certified. 25 mins from KIA. Flexible Payment Plans. Mountain Views.',
  NOW(), NOW()
),
(
  'Rehoboth Knightsbridge 2-Bedroom',
  'Modern 2-bedroom apartment with resort amenities and energy efficiency.',
  'apartment', 'sale', 45000, 'USD', 'Kwabenya', 'Kwabenya, Greater Accra', 'Greater Accra',
  2, 2,
  ARRAY['Swimming Pool','Basketball Court','Tennis Court','Gym','Spa','Sauna','Clinic','Creche','Shopping Mall','Pharmacy','24/7 Security'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 774 586', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Knightsbridge',
  '+233 263 774 586', '+233 263 774 586',
  '40% deposit and move in. 5-year payment plan available. EDGE Certified. IFC Partnership. Sustainable Building.',
  NOW(), NOW()
),
(
  'Rehoboth Knightsbridge 3-Bedroom',
  'Spacious 3-bedroom apartment ideal for families in award-winning development.',
  'apartment', 'sale', 65000, 'USD', 'Kwabenya', 'Kwabenya, Greater Accra', 'Greater Accra',
  3, 3,
  ARRAY['Swimming Pool','Basketball Court','Tennis Court','Gym','Spa','Sauna','Clinic','Creche','Shopping Mall','Pharmacy','24/7 Security'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 744 587', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Knightsbridge',
  '+233 263 744 587', '+233 263 744 587',
  '30 mins from Tetteh Quarshie Interchange. Mortgage via Ecobank. EDGE Certified. Family Living. Resort Amenities.',
  NOW(), NOW()
),
(
  'Rehoboth Palm 1-Bedroom',
  'EDGE-certified apartment in resort-style gated community with excellent amenities.',
  'apartment', 'sale', 35000, 'USD', 'Ayimensah', 'Ayimensah, Greater Accra', 'Greater Accra',
  1, 1,
  ARRAY['Swimming Pool','Basketball Court','Tennis Court','Playground','Shopping Mall','Laundromat','Restaurants','24/7 Security'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 791 663', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Palm',
  '+233 263 791 663', '+233 263 791 663',
  '1400 apartments. Great for short-let rentals. EDGE Certified. 25 mins from KIA. Resort Style.',
  NOW(), NOW()
),
(
  'Rehoboth Palm 2-Bedroom',
  'Two bedroom apartment with resort amenities and rental income potential.',
  'apartment', 'sale', 55000, 'USD', 'Ayimensah', 'Ayimensah, Greater Accra', 'Greater Accra',
  2, 2,
  ARRAY['Swimming Pool','Basketball Court','Tennis Court','Playground','Shopping Mall','Laundromat','Restaurants','24/7 Security'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 791 665', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Palm',
  '+233 263 791 665', '+233 263 791 665',
  'Popular for short-let investment. Strong rental returns. EDGE Certified. IFC Partnership. Payment Plans.',
  NOW(), NOW()
),
(
  'Rehoboth Palm 3-Bedroom',
  'Family-sized 3-bedroom in gated community with full resort amenities.',
  'apartment', 'sale', 75000, 'USD', 'Ayimensah', 'Ayimensah, Greater Accra', 'Greater Accra',
  3, 3,
  ARRAY['Swimming Pool','Basketball Court','Tennis Court','Playground','Shopping Mall','Laundromat','Restaurants','24/7 Security'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 774 585', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Palm',
  '+233 263 774 585', '+233 263 774 585',
  'One of two EDGE-certified Rehoboth developments. Family Living. Resort Lifestyle. Sustainable.',
  NOW(), NOW()
),
(
  'Rehoboth Gardens 3-Bedroom Townhouse',
  'Quality 3-bedroom townhouse with on-site shopping centre in secure estate.',
  'townhouse', 'sale', 85000, 'USD', 'Adenta', 'Malejor, Adenta, Greater Accra', 'Greater Accra',
  3, 3,
  ARRAY['Shopping Centre','24/7 Security','Gated Community','Good Roads'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 774 586', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Gardens',
  '+233 263 774 586', '+233 263 774 586',
  'Located in Adenta District. 7km from Kotoka Airport. Value for Money. Family Living. Secure Community.',
  NOW(), NOW()
),
(
  'Rehoboth Gardens 4-Bedroom Townhouse',
  'Executive 4-bedroom townhouse with premium finishes and amenities.',
  'townhouse', 'sale', 120000, 'USD', 'Adenta', 'Malejor, Adenta, Greater Accra', 'Greater Accra',
  4, 4,
  ARRAY['Shopping Centre','24/7 Security','Gated Community','Good Roads'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 744 587', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Gardens',
  '+233 263 744 587', '+233 263 744 587',
  'Executive Finish. Family Home. Secure Estate. On-site Amenities.',
  NOW(), NOW()
),
(
  'Rehoboth Hills 2-Bedroom',
  'Beverly Hills-themed luxury home on hillside with great views.',
  'house', 'sale', 150000, 'USD', 'Oyarifa', 'Oyarifa Hills, Greater Accra', 'Greater Accra',
  2, 2,
  ARRAY['Swimming Pool','Spa','Basketball Court','Shopping Mall','Laundromat','24/7 Security'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 791 663', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Hills City',
  '+233 263 791 663', '+233 263 791 663',
  'Ghana''s Beverly Hills. 1000 units on 40 acres. Hillside Location. Great Views. Serene Environment.',
  NOW(), NOW()
),
(
  'Rehoboth Hills 4-Bedroom',
  'Luxury 4-bedroom home with stunning views and premium amenities.',
  'house', 'sale', 250000, 'USD', 'Oyarifa', 'Oyarifa Hills, Greater Accra', 'Greater Accra',
  4, 4,
  ARRAY['Swimming Pool','Spa','Basketball Court','Shopping Mall','Laundromat','24/7 Security'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 791 665', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Hills City',
  '+233 263 791 665', '+233 263 791 665',
  'Serviced plots also available for custom builds. Luxury Design. Hilltop Views. High-End Finishes.',
  NOW(), NOW()
),
(
  'Rehoboth Hills 5-Bedroom',
  'Premium 5-bedroom luxury home for discerning buyers.',
  'house', 'sale', 350000, 'USD', 'Oyarifa', 'Oyarifa Hills, Greater Accra', 'Greater Accra',
  5, 5,
  ARRAY['Swimming Pool','Spa','Basketball Court','Shopping Mall','Laundromat','24/7 Security'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 774 585', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Rehoboth Hills City',
  '+233 263 774 585', '+233 263 774 585',
  'Near Accra business district. Excellent road connectivity. Premium Luxury. Expansive Views. Exclusive Community.',
  NOW(), NOW()
),
(
  'Grace Courts Villa - Short Let',
  'Fully furnished villa for short-let near University of Ghana.',
  'villa', 'rent', 2500, 'USD', 'Legon', 'Near Legon, Greater Accra', 'Greater Accra',
  3, 3,
  ARRAY['Fully Furnished','24/7 Security','Proximity to Legon'],
  'inactive', 'Rehoboth Properties', 'Rehoboth Properties', '+233 263 774 586', 'sales@rehobothpropertiesgh.com', 'Rehoboth Properties Ltd', 'Rehoboth Properties Ltd', 'Grace Courts',
  '+233 263 774 586', '+233 263 774 586',
  'Ideal for corporate relocations and extended stays. Short-Let. Corporate Stay. Quality Furnishings.',
  NOW(), NOW()
);
