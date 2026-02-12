'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserManagement from '@/components/admin/UserManagement';
import SubNavigation from '@/components/SubNavigation';

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!loading) {
      if (!user) {
        // Not authenticated - redirect to auth page
        router.push('/auth');
      } else {
        // Check if user has admin role (you may need to adjust this based on your user structure)
        // Since you're using Supabase User type, you might store role in user_metadata
        const userRole = user.user_metadata?.role || 'user';
        
        if (userRole !== 'admin') {
          // Not admin - redirect to dashboard
          router.push('/dashboard');
        }
      }
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not admin (will redirect)
  if (!user) {
    return null;
  }

  // Check user role - adjust this based on how you store roles in Supabase
  const userRole = user.user_metadata?.role || user.app_metadata?.role || 'user';
  
  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SubNavigation userRole="admin" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">Manage all users, agents, and administrators</p>
          </div>
          <UserManagement />
        </div>
      </div>
    </div>
  );
}
