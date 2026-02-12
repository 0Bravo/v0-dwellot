// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Property {
  id: string
  title: string
  description?: string
  price: number
  location: string
  property_type: string
  listing_type: 'sale' | 'rent'
  bedrooms: number
  bathrooms: number
  area?: number
  parking: number
  images: string[]
  features: string[]
  status: 'active' | 'inactive' | 'sold' | 'rented'
  featured: boolean
  agent_id?: string
  created_at: string
  updated_at: string
  // Joined data from users table
  users?: {
    id: string
    name?: string
    email: string
    phone?: string
    is_verified?: boolean
    avatar_url?: string
    bio?: string
  }
}

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: 'user' | 'agent' | 'admin'
  avatar_url?: string
  bio?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface SavedProperty {
  id: string
  user_id: string
  property_id: string
  created_at: string
}

export interface SavedPropertyWithDetails {
  id: string
  created_at: string
  property_id: string
  user_id: string
  properties: Property[]
}

export interface Inquiry {
  id: string
  property_id: string
  user_id?: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

export interface InquiryWithProperty {
  id: string
  property_id: string
  user_id?: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
  properties: {
    id: string
    title: string
    location: string
    price: number
    agent_id?: string
  }
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Database helper functions
export class PropertyService {
  // Get all properties with optional filters
  static async getProperties(filters?: {
    location?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    listingType?: 'sale' | 'rent'
    featured?: boolean
    limit?: number
    offset?: number
  }): Promise<ApiResponse<Property[]>> {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          users:agent_id (
            id,
            name,
            email,
            phone,
            is_verified,
            avatar_url,
            bio
          )
        `)
        .eq('status', 'active')

      // Apply filters
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters?.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms)
      }

      if (filters?.listingType) {
        query = query.eq('listing_type', filters.listingType)
      }

      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }

      // Pagination
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      // Order by creation date (newest first)
      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error('Error fetching properties:', error)
        return { data: null, error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  // Get single property by ID
  static async getProperty(id: string): Promise<ApiResponse<Property>> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          users:agent_id (
            id,
            name,
            email,
            phone,
            is_verified,
            avatar_url,
            bio
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single()

      if (error) {
        console.error('Error fetching property:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  // Create new property
  static async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'users'>): Promise<ApiResponse<Property>> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([property])
        .select(`
          *,
          users:agent_id (
            id,
            name,
            email,
            phone,
            is_verified
          )
        `)
        .single()

      if (error) {
        console.error('Error creating property:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  // Update property
  static async updateProperty(id: string, updates: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at' | 'users'>>): Promise<ApiResponse<Property>> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          users:agent_id (
            id,
            name,
            email,
            phone,
            is_verified
          )
        `)
        .single()

      if (error) {
        console.error('Error updating property:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  // Delete property (soft delete by setting status to inactive)
  static async deleteProperty(id: string): Promise<ApiResponse<Property>> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error deleting property:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  // Get properties by agent
  static async getPropertiesByAgent(agentId: string): Promise<ApiResponse<Property[]>> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          users:agent_id (
            id,
            name,
            email,
            phone,
            is_verified
          )
        `)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching agent properties:', error)
        return { data: null, error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }
}

// User service
export class UserService {
  static async getUser(id: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching user:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  static async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }
}

// Saved properties service
export class SavedPropertyService {
  static async toggleSavedProperty(userId: string, propertyId: string): Promise<ApiResponse<{ saved: boolean }>> {
    try {
      // Check if already saved
      const { data: existing } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single()

      if (existing) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', userId)
          .eq('property_id', propertyId)

        if (error) {
          console.error('Error removing saved property:', error)
          return { data: null, error: error.message }
        }

        return { data: { saved: false }, error: null }
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_properties')
          .insert([{ user_id: userId, property_id: propertyId }])

        if (error) {
          console.error('Error saving property:', error)
          return { data: null, error: error.message }
        }

        return { data: { saved: true }, error: null }
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  static async getSavedProperties(userId: string): Promise<ApiResponse<SavedPropertyWithDetails[]>> {
    try {
      const { data: savedPropertiesData, error } = await supabase
        .from('saved_properties')
        .select(`
          id,
          created_at,
          property_id,
          user_id,
          properties!inner (
            *,
            users:agent_id (
              id,
              name,
              email,
              phone
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false }) as { data: SavedPropertyWithDetails[] | null, error: Error | null }

      if (error) {
        console.error('Error fetching saved properties:', error)
        return { data: null, error: error.message }
      }

      return { data: savedPropertiesData || [], error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }
}

// Inquiry service
export class InquiryService {
  static async createInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at'>): Promise<ApiResponse<Inquiry>> {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([inquiry])
        .select()
        .single()

      if (error) {
        console.error('Error creating inquiry:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  static async getInquiriesForAgent(agentId: string): Promise<ApiResponse<InquiryWithProperty[]>> {
    try {
      const { data: inquiriesData, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          properties!inner (
            id,
            title,
            location,
            price,
            agent_id
          )
        `)
        .eq('properties.agent_id', agentId)
        .order('created_at', { ascending: false }) as { data: InquiryWithProperty[] | null, error: Error | null }

      if (error) {
        console.error('Error fetching inquiries:', error)
        return { data: null, error: error.message }
      }

      return { data: inquiriesData || [], error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }

  static async updateInquiryStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<ApiResponse<Inquiry>> {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating inquiry status:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { data: null, error: 'Unexpected error occurred' }
    }
  }
}

// Utility function to test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('properties')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Database connection failed:', error)
      return false
    }

    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('Database connection error:', error)
    return false
  }
}

// Export default supabase client
export default supabase
