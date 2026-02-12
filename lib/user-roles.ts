// User role definitions and permissions
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  AGENT = 'agent',
  PREMIUM_USER = 'premium_user',
  BASIC_USER = 'basic_user',
  GUEST = 'guest'
}

export enum Permission {
  // User Management
  DELETE_USER = 'delete_user',
  BAN_USER = 'ban_user',
  EDIT_USER_ROLE = 'edit_user_role',
  VIEW_ALL_USERS = 'view_all_users',
  
  // Property Management
  DELETE_ANY_PROPERTY = 'delete_any_property',
  EDIT_ANY_PROPERTY = 'edit_any_property',
  APPROVE_PROPERTIES = 'approve_properties',
  FEATURE_PROPERTIES = 'feature_properties',
  
  // Agent Management
  APPROVE_AGENTS = 'approve_agents',
  SUSPEND_AGENTS = 'suspend_agents',
  VIEW_AGENT_ANALYTICS = 'view_agent_analytics',
  
  // Content Management
  MANAGE_SITE_CONTENT = 'manage_site_content',
  MODERATE_REVIEWS = 'moderate_reviews',
  MANAGE_BLOG = 'manage_blog',
  
  // System Management
  VIEW_SYSTEM_ANALYTICS = 'view_system_analytics',
  MANAGE_PAYMENTS = 'manage_payments',
  EXPORT_DATA = 'export_data',
  MANAGE_SETTINGS = 'manage_settings',
  
  // Property Actions (Users)
  CREATE_PROPERTY = 'create_property',
  EDIT_OWN_PROPERTY = 'edit_own_property',
  DELETE_OWN_PROPERTY = 'delete_own_property',
  SAVE_PROPERTIES = 'save_properties',
  CONTACT_AGENTS = 'contact_agents',
  
  // Premium Features
  UNLIMITED_SAVES = 'unlimited_saves',
  PRIORITY_SUPPORT = 'priority_support',
  ADVANCED_SEARCH = 'advanced_search',
  PROPERTY_ALERTS = 'property_alerts',
  MARKET_INSIGHTS = 'market_insights'
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Full system access
    Permission.DELETE_USER,
    Permission.BAN_USER,
    Permission.EDIT_USER_ROLE,
    Permission.VIEW_ALL_USERS,
    Permission.DELETE_ANY_PROPERTY,
    Permission.EDIT_ANY_PROPERTY,
    Permission.APPROVE_PROPERTIES,
    Permission.FEATURE_PROPERTIES,
    Permission.APPROVE_AGENTS,
    Permission.SUSPEND_AGENTS,
    Permission.VIEW_AGENT_ANALYTICS,
    Permission.MANAGE_SITE_CONTENT,
    Permission.MODERATE_REVIEWS,
    Permission.MANAGE_BLOG,
    Permission.VIEW_SYSTEM_ANALYTICS,
    Permission.MANAGE_PAYMENTS,
    Permission.EXPORT_DATA,
    Permission.MANAGE_SETTINGS,
    Permission.CREATE_PROPERTY,
    Permission.EDIT_OWN_PROPERTY,
    Permission.DELETE_OWN_PROPERTY,
    Permission.SAVE_PROPERTIES,
    Permission.CONTACT_AGENTS,
    Permission.UNLIMITED_SAVES,
    Permission.PRIORITY_SUPPORT,
    Permission.ADVANCED_SEARCH,
    Permission.PROPERTY_ALERTS,
    Permission.MARKET_INSIGHTS
  ],
  
  [UserRole.ADMIN]: [
    // Most admin powers except user role editing
    Permission.BAN_USER,
    Permission.VIEW_ALL_USERS,
    Permission.DELETE_ANY_PROPERTY,
    Permission.EDIT_ANY_PROPERTY,
    Permission.APPROVE_PROPERTIES,
    Permission.FEATURE_PROPERTIES,
    Permission.APPROVE_AGENTS,
    Permission.SUSPEND_AGENTS,
    Permission.VIEW_AGENT_ANALYTICS,
    Permission.MANAGE_SITE_CONTENT,
    Permission.MODERATE_REVIEWS,
    Permission.MANAGE_BLOG,
    Permission.VIEW_SYSTEM_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.CREATE_PROPERTY,
    Permission.EDIT_OWN_PROPERTY,
    Permission.DELETE_OWN_PROPERTY,
    Permission.SAVE_PROPERTIES,
    Permission.CONTACT_AGENTS,
    Permission.UNLIMITED_SAVES,
    Permission.PRIORITY_SUPPORT,
    Permission.ADVANCED_SEARCH,
    Permission.PROPERTY_ALERTS,
    Permission.MARKET_INSIGHTS
  ],
  
  [UserRole.MODERATOR]: [
    // Content moderation and basic admin
    Permission.VIEW_ALL_USERS,
    Permission.APPROVE_PROPERTIES,
    Permission.MODERATE_REVIEWS,
    Permission.MANAGE_BLOG,
    Permission.CREATE_PROPERTY,
    Permission.EDIT_OWN_PROPERTY,
    Permission.DELETE_OWN_PROPERTY,
    Permission.SAVE_PROPERTIES,
    Permission.CONTACT_AGENTS,
    Permission.ADVANCED_SEARCH,
    Permission.PROPERTY_ALERTS
  ],
  
  [UserRole.AGENT]: [
    // Agent-specific permissions
    Permission.CREATE_PROPERTY,
    Permission.EDIT_OWN_PROPERTY,
    Permission.DELETE_OWN_PROPERTY,
    Permission.SAVE_PROPERTIES,
    Permission.CONTACT_AGENTS,
    Permission.VIEW_AGENT_ANALYTICS,
    Permission.ADVANCED_SEARCH,
    Permission.PROPERTY_ALERTS,
    Permission.MARKET_INSIGHTS
  ],
  
  [UserRole.PREMIUM_USER]: [
    // Premium user features
    Permission.SAVE_PROPERTIES,
    Permission.CONTACT_AGENTS,
    Permission.UNLIMITED_SAVES,
    Permission.PRIORITY_SUPPORT,
    Permission.ADVANCED_SEARCH,
    Permission.PROPERTY_ALERTS,
    Permission.MARKET_INSIGHTS
  ],
  
  [UserRole.BASIC_USER]: [
    // Basic user permissions
    Permission.SAVE_PROPERTIES,
    Permission.CONTACT_AGENTS
  ],
  
  [UserRole.GUEST]: [
    // No special permissions - just browse
  ]
}

// Role limits and quotas
export const ROLE_LIMITS: Record<UserRole, {
  maxSavedProperties: number;
  maxPropertyListings: number;
  maxContactsPerDay: number;
  canListProperties: boolean;
  hasAnalytics: boolean;
  supportPriority: 'low' | 'normal' | 'high' | 'critical';
}> = {
  [UserRole.SUPER_ADMIN]: {
    maxSavedProperties: -1, // unlimited
    maxPropertyListings: -1,
    maxContactsPerDay: -1,
    canListProperties: true,
    hasAnalytics: true,
    supportPriority: 'critical'
  },
  [UserRole.ADMIN]: {
    maxSavedProperties: -1,
    maxPropertyListings: -1,
    maxContactsPerDay: -1,
    canListProperties: true,
    hasAnalytics: true,
    supportPriority: 'critical'
  },
  [UserRole.MODERATOR]: {
    maxSavedProperties: 100,
    maxPropertyListings: 50,
    maxContactsPerDay: 100,
    canListProperties: true,
    hasAnalytics: true,
    supportPriority: 'high'
  },
  [UserRole.AGENT]: {
    maxSavedProperties: 200,
    maxPropertyListings: -1, // unlimited for agents
    maxContactsPerDay: 200,
    canListProperties: true,
    hasAnalytics: true,
    supportPriority: 'high'
  },
  [UserRole.PREMIUM_USER]: {
    maxSavedProperties: -1, // unlimited
    maxPropertyListings: 0, // can't list
    maxContactsPerDay: 50,
    canListProperties: false,
    hasAnalytics: false,
    supportPriority: 'high'
  },
  [UserRole.BASIC_USER]: {
    maxSavedProperties: 10,
    maxPropertyListings: 0,
    maxContactsPerDay: 5,
    canListProperties: false,
    hasAnalytics: false,
    supportPriority: 'normal'
  },
  [UserRole.GUEST]: {
    maxSavedProperties: 0,
    maxPropertyListings: 0,
    maxContactsPerDay: 0,
    canListProperties: false,
    hasAnalytics: false,
    supportPriority: 'low'
  }
}

// Role descriptions for UI
export const ROLE_DESCRIPTIONS: Record<UserRole, {
  title: string;
  description: string;
  badge: string;
  color: string;
}> = {
  [UserRole.SUPER_ADMIN]: {
    title: 'Super Administrator',
    description: 'Full system access with all permissions',
    badge: 'SUPER',
    color: 'bg-red-600 text-white'
  },
  [UserRole.ADMIN]: {
    title: 'Administrator',
    description: 'Manage users, properties, and system settings',
    badge: 'ADMIN',
    color: 'bg-purple-600 text-white'
  },
  [UserRole.MODERATOR]: {
    title: 'Moderator',
    description: 'Content moderation and property approval',
    badge: 'MOD',
    color: 'bg-blue-600 text-white'
  },
  [UserRole.AGENT]: {
    title: 'Real Estate Agent',
    description: 'List and manage properties professionally',
    badge: 'AGENT',
    color: 'bg-green-600 text-white'
  },
  [UserRole.PREMIUM_USER]: {
    title: 'Premium User',
    description: 'Enhanced features and unlimited saves',
    badge: 'PREMIUM',
    color: 'bg-yellow-600 text-white'
  },
  [UserRole.BASIC_USER]: {
    title: 'Basic User',
    description: 'Browse and save properties',
    badge: 'USER',
    color: 'bg-gray-600 text-white'
  },
  [UserRole.GUEST]: {
    title: 'Guest',
    description: 'Browse properties without account',
    badge: 'GUEST',
    color: 'bg-gray-400 text-white'
  }
}

// Permission checker utility
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

// Multiple permissions checker
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission))
}

// Role hierarchy checker (higher roles can do what lower roles can do)
export function hasRoleOrHigher(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy = [
    UserRole.GUEST,
    UserRole.BASIC_USER,
    UserRole.PREMIUM_USER,
    UserRole.AGENT,
    UserRole.MODERATOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN
  ]
  
  const userIndex = hierarchy.indexOf(userRole)
  const requiredIndex = hierarchy.indexOf(requiredRole)
  
  return userIndex >= requiredIndex
}

// Get user limits
export function getUserLimits(userRole: UserRole) {
  return ROLE_LIMITS[userRole]
}

// Get role description
export function getRoleDescription(userRole: UserRole) {
  return ROLE_DESCRIPTIONS[userRole]
}
