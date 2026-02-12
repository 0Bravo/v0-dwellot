// src/types/index.ts
// Shared types for the entire application

export type UserRole = 'user' | 'agent' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  verification_status: 'pending' | 'verified' | 'rejected';
  phone?: string;
  avatar_url?: string;
  bio?: string;
  agency_name?: string;
  license_number?: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  agencyName?: string;
  licenseNumber?: string;
}

export interface AuthResult {
  error: Error | null;
}

// Property related types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  property_type: string;
  listing_type: 'sale' | 'rent';
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking?: number;
  year_built?: number;
  furnished: string;
  features: string[];
  images: string[];
  agent_id: string;
  status: 'pending' | 'active' | 'sold' | 'rented' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Dashboard specific types
export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalAgents: number;
  pendingVerifications: number;
}

export interface AgentStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  totalViews: number;
  totalInquiries: number;
}
