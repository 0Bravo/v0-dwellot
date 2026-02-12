'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building, 
  Users, 
  BarChart3, 
  Settings, 
  Bell,
  Plus,
  Search,
  ChevronDown
} from 'lucide-react';

interface SubNavigationProps {
  userRole?: 'admin' | 'agent' | 'user';
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles?: Array<'admin' | 'agent' | 'user'>;
}

export default function SubNavigation({ userRole = 'user' }: SubNavigationProps) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['admin', 'agent', 'user']
    },
    {
      name: 'Properties',
      href: '/dashboard/properties',
      icon: Building,
      roles: ['admin', 'agent', 'user']
    },
    {
      name: 'Users',
      href: '/dashboard/admin/users',
      icon: Users,
      roles: ['admin']
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      roles: ['admin', 'agent']
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      roles: ['admin', 'agent', 'user']
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const quickActions = [
    { name: 'Add Property', href: '/dashboard/properties/add', icon: Plus },
    { name: 'Search Properties', href: '/dashboard/search', icon: Search },
    { name: 'View Reports', href: '/dashboard/reports', icon: BarChart3 }
  ];

  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Main Navigation */}
          <nav className="flex space-x-8">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Quick Actions</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {quickActions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <Link
                          key={action.name}
                          href={action.href}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <ActionIcon className="h-4 w-4" />
                          <span>{action.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
