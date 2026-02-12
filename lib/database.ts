import { supabase } from './supabase'

// Core interfaces
export interface Property {
  id: number
  title: string
  description: string
  price: number
  location: string
  address: string
  property_type: string
  listing_type: string
  bedrooms: number
  bathrooms: number
  area_sqm: number
  images: string[]
  features: string[]
  agent_id: string
  status: string
  created_at: string
  updated_at: string
}

export interface PropertyData {
  id?: number
  title: string
  description: string
  price: number
  location: string
  address: string
  property_type: string
  listing_type: string
  bedrooms: number
  bathrooms: number
  area_sqm: number
  images: string[]
  features: string[]
  agent_id: string
  status: string
}

export interface SavedProperty {
  id: number
  user_id: string
  property_id: number
  created_at: string
  properties: Property
}

export interface UserActivity {
  id: number
  user_id: string
  action_type: string
  property_id?: number
  property_title?: string
  details?: string
  created_at: string
}

export interface QueryParams {
  [key: string]: string | number | boolean | string[] | undefined
}

export interface FilterOptions {
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  property_type?: string
  listing_type?: string
  location?: string
  search?: string
}

export interface SupabaseResponse<T> {
  data: T[] | T | null
  error: Error | null
}

// Function to create a new property
export async function createProperty(propertyData: PropertyData): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single()

    if (error) {
      console.error('Error creating property:', error)
      return null
    }

    return data as Property
  } catch (error) {
    console.error('Error creating property:', error)
    return null
  }
}

// Function to get all properties with optional filters
export async function getProperties(filters?: FilterOptions): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')

    // Apply filters if provided
    if (filters) {
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }
      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms)
      }
      if (filters.bathrooms) {
        query = query.eq('bathrooms', filters.bathrooms)
      }
      if (filters.property_type) {
        query = query.eq('property_type', filters.property_type)
      }
      if (filters.listing_type) {
        query = query.eq('listing_type', filters.listing_type)
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`)
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
      return []
    }

    return data as Property[]
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

// Function to get a single property by ID
export async function getPropertyById(id: number): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching property:', error)
      return null
    }

    return data as Property
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

// Function to update a property
export async function updateProperty(id: number, updates: Partial<PropertyData>): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating property:', error)
      return null
    }

    return data as Property
  } catch (error) {
    console.error('Error updating property:', error)
    return null
  }
}

// Function to delete a property
export async function deleteProperty(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting property:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting property:', error)
    return false
  }
}

// Function to get properties by agent ID
export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching agent properties:', error)
      return []
    }

    return data as Property[]
  } catch (error) {
    console.error('Error fetching agent properties:', error)
    return []
  }
}

// Function to save a property for a user
export async function saveProperty(userId: string, propertyId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('saved_properties')
      .insert([{ user_id: userId, property_id: propertyId }])

    if (error) {
      console.error('Error saving property:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error saving property:', error)
    return false
  }
}

// Function to get saved properties for a user
export async function getSavedProperties(userId: string): Promise<SavedProperty[]> {
  try {
    const { data, error } = await supabase
      .from('saved_properties')
      .select(`
        *,
        properties (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved properties:', error)
      return []
    }

    return data as SavedProperty[]
  } catch (error) {
    console.error('Error fetching saved properties:', error)
    return []
  }
}

// Function to remove a saved property
export async function removeSavedProperty(userId: string, propertyId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId)

    if (error) {
      console.error('Error removing saved property:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error removing saved property:', error)
    return false
  }
}

// Function to log user activity
export async function logUserActivity(
  userId: string, 
  actionType: string, 
  propertyId?: number, 
  propertyTitle?: string, 
  details?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_activities')
      .insert([{
        user_id: userId,
        action_type: actionType,
        property_id: propertyId,
        property_title: propertyTitle,
        details: details
      }])

    if (error) {
      console.error('Error logging user activity:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error logging user activity:', error)
    return false
  }
}

// Function to get user activities
export async function getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user activities:', error)
      return []
    }

    return data as UserActivity[]
  } catch (error) {
    console.error('Error fetching user activities:', error)
    return []
  }
}

// Alias for backward compatibility
export const getUserActivity = getUserActivities

// Function to get user statistics
export async function getUserStats(userId: string): Promise<{
  totalSaved: number
  totalViewed: number
  totalInquiries: number
  recentActivity: UserActivity[]
} | null> {
  try {
    // Get saved properties count
    const { data: savedData, error: savedError } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', userId)

    if (savedError) {
      console.error('Error fetching saved properties count:', savedError)
      return null
    }

    // Get recent activities
    const recentActivity = await getUserActivities(userId, 10)

    // Count different activity types
    const totalViewed = recentActivity.filter(a => a.action_type === 'view').length
    const totalInquiries = recentActivity.filter(a => a.action_type === 'inquiry').length

    return {
      totalSaved: savedData?.length || 0,
      totalViewed,
      totalInquiries,
      recentActivity
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return null
  }
}

// Function to unsave/remove a property (alias for removeSavedProperty)
export const unsaveProperty = removeSavedProperty

// Function to search properties with advanced filters
export async function searchProperties(
  searchTerm: string, 
  filters: FilterOptions = {}
): Promise<Property[]> {
  try {
    let queryBuilder = supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')

    // Apply search term
    if (searchTerm.trim()) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,features.cs.{${searchTerm}}`
      )
    }

    // Apply filters
    const params: QueryParams = {}
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.bedrooms) params.bedrooms = filters.bedrooms
    if (filters.bathrooms) params.bathrooms = filters.bathrooms
    if (filters.property_type) params.property_type = filters.property_type
    if (filters.listing_type) params.listing_type = filters.listing_type

    // Apply price range filters
    if (params.minPrice && typeof params.minPrice === 'number') {
      queryBuilder = queryBuilder.gte('price', params.minPrice)
    }
    if (params.maxPrice && typeof params.maxPrice === 'number') {
      queryBuilder = queryBuilder.lte('price', params.maxPrice)
    }

    // Apply other filters
    if (params.bedrooms && typeof params.bedrooms === 'number') {
      queryBuilder = queryBuilder.eq('bedrooms', params.bedrooms)
    }
    if (params.bathrooms && typeof params.bathrooms === 'number') {
      queryBuilder = queryBuilder.eq('bathrooms', params.bathrooms)
    }
    if (params.property_type && typeof params.property_type === 'string') {
      queryBuilder = queryBuilder.eq('property_type', params.property_type)
    }
    if (params.listing_type && typeof params.listing_type === 'string') {
      queryBuilder = queryBuilder.eq('listing_type', params.listing_type)
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching properties:', error)
      return []
    }

    return data as Property[]
  } catch (error) {
    console.error('Error searching properties:', error)
    return []
  }
}

// Function to build query string from filters
export function buildQueryString(options: QueryParams): string {
  const params = new URLSearchParams()
  
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        params.append(key, value.join(','))
      } else {
        params.append(key, String(value))
      }
    }
  })
  
  return params.toString()
}

// Function to get property statistics
export async function getPropertyStats(): Promise<{
  total: number
  forSale: number
  forRent: number
  avgPrice: number
} | null> {
  try {
    const { data: allProperties, error } = await supabase
      .from('properties')
      .select('price, listing_type')
      .eq('status', 'active')

    if (error) {
      console.error('Error fetching property stats:', error)
      return null
    }

    const properties = allProperties as Array<{ price: number; listing_type: string }>
    
    const total = properties.length
    const forSale = properties.filter(p => p.listing_type === 'sale').length
    const forRent = properties.filter(p => p.listing_type === 'rent').length
    const avgPrice = properties.length > 0 
      ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length 
      : 0

    return { total, forSale, forRent, avgPrice }
  } catch (error) {
    console.error('Error calculating property stats:', error)
    return null
  }
}

// Function to process property data before saving
export function processPropertyData(input: PropertyData): PropertyData {
  return {
    ...input,
    title: input.title?.trim() || '',
    description: input.description?.trim() || '',
    location: input.location?.trim() || '',
    address: input.address?.trim() || '',
    price: Number(input.price) || 0,
    bedrooms: Number(input.bedrooms) || 0,
    bathrooms: Number(input.bathrooms) || 0,
    area_sqm: Number(input.area_sqm) || 0,
    images: Array.isArray(input.images) ? input.images : [],
    features: Array.isArray(input.features) ? input.features : [],
    agent_id: input.agent_id?.trim() || '',
    status: input.status || 'active'
  }
}

// Function to validate property data
export function validatePropertyData(propertyData: PropertyData): string[] {
  const errors: string[] = []

  if (!propertyData.title?.trim()) {
    errors.push('Title is required')
  }
  if (!propertyData.description?.trim()) {
    errors.push('Description is required')
  }
  if (!propertyData.location?.trim()) {
    errors.push('Location is required')
  }
  if (!propertyData.address?.trim()) {
    errors.push('Address is required')
  }
  if (!propertyData.property_type?.trim()) {
    errors.push('Property type is required')
  }
  if (!propertyData.listing_type?.trim()) {
    errors.push('Listing type is required')
  }
  if (!propertyData.agent_id?.trim()) {
    errors.push('Agent ID is required')
  }
  if (propertyData.price <= 0) {
    errors.push('Price must be greater than 0')
  }
  if (propertyData.bedrooms < 0) {
    errors.push('Bedrooms cannot be negative')
  }
  if (propertyData.bathrooms < 0) {
    errors.push('Bathrooms cannot be negative')
  }
  if (propertyData.area_sqm <= 0) {
    errors.push('Area must be greater than 0')
  }

  return errors
}
