# Property Data Collection Guide

This guide explains how to capture and load your real properties into the Dwellot database.

## Required Information for Each Property

### Basic Information
1. **Title** (text, required)
   - Example: "Luxury 4 Bedroom Villa in East Legon"
   - Keep it descriptive and under 100 characters

2. **Description** (text, required)
   - Detailed description of the property
   - Include key features, condition, and unique selling points
   - Example: "Spacious modern villa with contemporary finishes, located in the heart of East Legon. Features include a large living area, modern kitchen, and beautiful garden."

3. **Price** (number, required)
   - In Ghanaian Cedis (GHS)
   - Example: 850000 (for GHS 850,000)
   - Do not include currency symbols or commas

4. **Location** (text, required)
   - Neighborhood or area name
   - Example: "East Legon, Accra"

### Property Details
5. **Property Type** (text, required)
   - Options: "House", "Apartment", "Villa", "Townhouse", "Land", "Commercial"
   - Example: "Villa"

6. **Listing Type** (text, required)
   - Options: "sale" or "rent"
   - Example: "sale"

7. **Bedrooms** (number, required)
   - Number of bedrooms
   - Example: 4

8. **Bathrooms** (number, required)
   - Number of bathrooms
   - Example: 3

9. **Area** (number, required)
   - Size in square meters
   - Example: 350

10. **Parking** (number, optional)
    - Number of parking spaces
    - Example: 2
    - Use 0 if no parking

### Additional Information
11. **Amenities** (list, optional)
    - Array of amenities
    - Examples: "Swimming Pool", "Gym", "Security", "Generator", "Air Conditioning", "Garden", "Balcony"
    - You can add multiple amenities

12. **Featured** (boolean, required)
    - true = Show on homepage as featured property
    - false = Regular listing
    - Example: false

13. **Status** (text, required)
    - Options: "active", "pending", "sold", "rented", "inactive"
    - Use "active" for properties ready to be shown
    - Example: "active"

14. **Agent Name** (text, optional)
    - Name of the listing agent
    - Example: "Kwame Mensah"

15. **Agent Phone** (text, optional)
    - Contact phone number
    - Example: "+233 24 123 4567"

16. **Images** (list, required)
    - Array of image URLs
    - You have 3 options:
      
      **Option A: Use Placeholder Images (Recommended for testing)**
      \`\`\`
      '/placeholder.svg?height=600&width=800'
      \`\`\`
      
      **Option B: Upload to Vercel Blob Storage**
      - Upload your images to Vercel Blob
      - Use the returned URLs
      
      **Option C: Use External URLs**
      - Host images on a CDN or image hosting service
      - Make sure URLs are publicly accessible
      - Add domain to next.config.ts remotePatterns

## Data Collection Template

Use this CSV template to organize your property data:

\`\`\`csv
title,description,price,location,property_type,listing_type,bedrooms,bathrooms,area,parking,amenities,featured,status,agent,phone,image1,image2,image3,image4
"Luxury 4 Bedroom Villa","Spacious modern villa...",850000,"East Legon, Accra",Villa,sale,4,3,350,2,"Swimming Pool|Security|Garden",false,active,"Kwame Mensah","+233 24 123 4567","/placeholder.svg?height=600&width=800","/placeholder.svg?height=600&width=800","/placeholder.svg?height=600&width=800","/placeholder.svg?height=600&width=800"
\`\`\`

## How to Load Your Properties

### Step 1: Prepare Your Data
1. Fill out the CSV template above with your property details
2. Save it as `my_properties.csv`

### Step 2: Convert to SQL
1. Use the provided SQL template (see `PROPERTY_INSERT_TEMPLATE.sql`)
2. Replace the placeholder values with your actual data
3. For amenities, format as: `ARRAY['Swimming Pool', 'Security', 'Garden']`
4. For images, format as: `ARRAY['url1', 'url2', 'url3', 'url4']`

### Step 3: Run the SQL Script
1. Go to your v0 chat
2. Create a new SQL file in the `scripts/` folder
3. Paste your SQL INSERT statements
4. The script will automatically run and insert your properties

### Example SQL Insert Statement

\`\`\`sql
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
  'Luxury 4 Bedroom Villa in East Legon',
  'Spacious modern villa with contemporary finishes, located in the heart of East Legon. Features include a large living area, modern kitchen, and beautiful garden.',
  850000,
  'East Legon, Accra',
  'Villa',
  'sale',
  4,
  3,
  350,
  2,
  ARRAY['Swimming Pool', 'Security', 'Garden', 'Generator'],
  false,
  'active',
  'Kwame Mensah',
  '+233 24 123 4567',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ]
);
\`\`\`

## Important Notes

1. **Agent ID**: If you're logged in as an agent, the system will automatically assign your user ID as the `agent_id`. If you're inserting via SQL, you can leave this field out and it will be NULL.

2. **Timestamps**: The `created_at` and `updated_at` fields are automatically set by the database.

3. **View Count**: This is automatically tracked and starts at 0.

4. **Images**: 
   - Minimum 1 image required
   - Recommended 4-6 images per property
   - Use descriptive queries in placeholder URLs for better generated images
   - Images should be at least 800x600 pixels

5. **Price Format**: 
   - Always use numbers without commas or currency symbols
   - Example: 850000 (not "GHS 850,000" or "850,000")

6. **Status Values**:
   - `active` - Property is live and visible to buyers
   - `pending` - Property is under review
   - `sold` - Property has been sold
   - `rented` - Property has been rented
   - `inactive` - Property is not visible to buyers

## Need Help?

If you need assistance:
1. Check the example properties in the database
2. Review the seed data scripts in the `scripts/` folder
3. Ask in the chat for help with specific fields or formatting
