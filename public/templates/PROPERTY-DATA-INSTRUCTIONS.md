# Property Data Collection Guide

## Instructions for Data Collector

Use the `property-data-collection.csv` file to capture property details from agents. Open it in Excel or Google Sheets.

---

## Field Descriptions

### Required Fields (Must be filled)

| Field | Description | Example |
|-------|-------------|---------|
| **Property Reference** | Unique ID you assign (PROP-001, PROP-002, etc.) | PROP-001 |
| **Property Title** | Short, descriptive title | 3 Bedroom Villa in East Legon |
| **Property Description** | Detailed description (2-3 sentences minimum) | A beautiful modern villa with spacious rooms... |
| **Property Type** | Must be one of: `house`, `apartment`, `land`, `commercial`, `office` | house |
| **Listing Type** | Must be: `sale` or `rent` | sale |
| **Price (USD)** | Price in US Dollars (numbers only, no commas) | 450000 |
| **Location/Address** | Street address or area description | 14 Palm Avenue |
| **City** | City name | Accra |
| **Country** | Country name | Ghana |

### Property Details

| Field | Description | Example |
|-------|-------------|---------|
| **Number of Bedrooms** | Number (use 0 for land/commercial) | 3 |
| **Number of Bathrooms** | Number (use 0 for land) | 2 |
| **Property Size (sqm)** | Size in square meters | 250 |
| **Number of Parking Spaces** | Number of parking spots | 2 |
| **Year Built** | Year constructed (leave blank if unknown) | 2020 |

### Amenities & Features

| Field | Description | Example |
|-------|-------------|---------|
| **Amenities** | List separated by `|` symbol | Swimming Pool\|Garden\|Security |
| **Property Features** | Additional features/selling points | Gated community with 24hr security |

### Agent/Contact Information

| Field | Description | Example |
|-------|-------------|---------|
| **Agent Name** | Full name of listing agent | John Mensah |
| **Agent Phone** | Phone with country code | +233 24 123 4567 |
| **Agent Email** | Email address | john@realestate.gh |
| **Agent Company** | Real estate company name | Prime Realty Ghana |
| **Owner Name** | If different from agent | (optional) |
| **Owner Contact** | Owner phone/email | (optional) |

### Images

| Field | Description | Example |
|-------|-------------|---------|
| **Image 1-5 URL/Filename** | URL or filename of property photos | photo1.jpg or https://... |

> **Image Tips:**
> - Request high-quality photos from agents
> - Name files clearly: `PROP-001-exterior.jpg`, `PROP-001-living.jpg`
> - Collect at least 3 images per property
> - First image should be the best exterior/front view

### Administrative

| Field | Description | Example |
|-------|-------------|---------|
| **Notes** | Any additional information | Corner plot with extra land |
| **Date Captured** | Date you collected this data | 2025-01-15 |
| **Status** | `pending` (new), `verified` (confirmed), `uploaded` (on website) | pending |

---

## Common Amenities List

Copy/paste from this list as needed (separate with `|`):

- Swimming Pool
- Garden
- Security
- Air Conditioning
- Gym/Fitness Center
- Parking
- Balcony
- Terrace
- Generator
- Borehole
- Boys Quarters
- Store Room
- Laundry Room
- CCTV
- Intercom
- Solar Panels
- Gated Community
- Children's Play Area
- Clubhouse
- Tennis Court

---

## Property Type Reference

| Type | Use For |
|------|---------|
| `house` | Standalone houses, villas, bungalows, townhouses |
| `apartment` | Flats, condos, penthouses, studio apartments |
| `land` | Empty plots, serviced plots, agricultural land |
| `commercial` | Shops, warehouses, factories, retail spaces |
| `office` | Office buildings, co-working spaces |

---

## Checklist Before Submitting

- [ ] All required fields are filled
- [ ] Price is in USD (convert if necessary)
- [ ] Property type is one of the 5 options
- [ ] At least 3 images collected/referenced
- [ ] Agent contact information is complete
- [ ] Description is detailed (not just "nice house")
- [ ] Location is specific enough to find

---

## Questions?

Contact the admin team for clarification on any fields.
