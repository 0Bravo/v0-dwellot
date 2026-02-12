'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      className={`flex items-center space-x-1 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Home icon for first item */}
      <Link 
        href="/"
        className="text-gray-500 hover:text-blue-600 transition-colors p-1"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
          
          {item.current || !item.href ? (
            <span 
              className={`font-medium ${
                item.current 
                  ? 'text-gray-900' 
                  : 'text-gray-500'
              }`}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-blue-600 transition-colors font-medium"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

// Usage examples:
export const BreadcrumbExamples = {
  // Property listing page
  properties: [
    { label: 'Properties', href: '/properties' },
    { label: 'Accra', href: '/properties?location=accra' },
    { label: 'East Legon', current: true }
  ],
  
  // Property details page
  propertyDetails: [
    { label: 'Properties', href: '/properties' },
    { label: 'Accra', href: '/properties?location=accra' },
    { label: 'East Legon', href: '/properties?location=east-legon' },
    { label: '4 Bedroom House in East Legon', current: true }
  ],
  
  // Agent profile
  agentProfile: [
    { label: 'Find Agents', href: '/agents' },
    { label: 'Accra Agents', href: '/agents?location=accra' },
    { label: 'John Mensah - Premium Properties', current: true }
  ],
  
  // User dashboard
  dashboard: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Saved Properties', current: true }
  ],
  
  // Admin sections
  adminUsers: [
    { label: 'Admin', href: '/admin' },
    { label: 'User Management', current: true }
  ]
};
