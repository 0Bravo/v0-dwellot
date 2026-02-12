// src/lib/properties.ts
import { supabase } from './supabase';

export interface Property {
  id?: number;
  title: string;
  description?: string;
  address: string;
  city: string;
  region: string;
  price: number;
  currency?: string;
  property_type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  amenities?: string[];
  features?: string[];
  images?: string[];
  thumbnail?: string;
  agent_id?: number;
  agent_name?: string;
  agent_phone?: string;
  agent_email?: string;
  slug?: string;
  featured?: boolean;
  verified?: boolean;
  views?: number;
  listing_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch all properties
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }

  return data as Property[];
}

// Fetch single property by ID
export async function fetchPropertyById(id: number) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    throw error;
  }

  return data as Property;
}

// Create new property
export async function createProperty(property: Property) {
  const { data, error } = await supabase
    .from('properties')
    .insert([property])
    .select()
    .single();

  if (error) {
    console.error('Error creating property:', error);
    throw error;
  }

  return data as Property;
}

// Update property
export async function updateProperty(id: number, updates: Partial<Property>) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating property:', error);
    throw error;
  }

  return data as Property;
}

// Delete property
export async function deleteProperty(id: number) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting property:', error);
    throw error;
  }

  return true;
}

// Filter properties
export async function filterProperties(filters: {
  city?: string;
  region?: string;
  property_type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
}) {
  let query = supabase.from('properties').select('*');

  if (filters.city) {
    query = query.eq('city', filters.city);
  }
  if (filters.region) {
    query = query.eq('region', filters.region);
  }
  if (filters.property_type) {
    query = query.eq('property_type', filters.property_type);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.min_price) {
    query = query.gte('price', filters.min_price);
  }
  if (filters.max_price) {
    query = query.lte('price', filters.max_price);
  }
  if (filters.bedrooms) {
    query = query.eq('bedrooms', filters.bedrooms);
  }
  if (filters.bathrooms) {
    query = query.eq('bathrooms', filters.bathrooms);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error filtering properties:', error);
    throw error;
  }

  return data as Property[];
}

// Search properties by title or description
export async function searchProperties(searchTerm: string) {
  const searchPattern = `%${searchTerm}%`;
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .or(`title.ilike.${searchPattern},description.ilike.${searchPattern},city.ilike.${searchPattern}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching properties:', error);
    throw error;
  }

  return data as Property[];
}
