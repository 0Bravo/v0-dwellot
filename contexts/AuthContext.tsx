'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserRole, UserProfile, SignUpData } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData?: SignUpData) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch user profile with rate limiting
  const fetchUserProfile = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
    if (profileLoading && retryCount === 0) {
      console.log('⏳ Profile fetch already in progress, skipping...');
      return null;
    }

    setProfileLoading(true);
    
    try {
      console.log('👤 Fetching user profile for:', userId);
      
      // Add delay to prevent rate limiting
      if (retryCount > 0) {
        const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
        console.log(`⏳ Waiting ${delay}ms before retry ${retryCount}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('❌ Profile fetch error:', error);
        
        // Retry on certain errors
        if (error.code === '23503' && retryCount < 3) {
          console.log(`🔄 Retrying profile fetch (attempt ${retryCount + 1})`);
          return await fetchUserProfile(userId, retryCount + 1);
        }
        
        // If no profile exists, create one
        if (error.code === 'PGRST116' || error.message.includes('No rows')) {
          console.log('🔨 Creating missing user profile...');
          return await createUserProfile(userId);
        }
        
        throw error;
      }

      console.log('✅ Profile fetched successfully:', data.role);
      return data;
      
    } catch (error) {
      console.error('💥 Profile fetch failed:', error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Create user profile if missing
  const createUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🔨 Creating user profile for:', userId);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No user data');

      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: userData.user.email,
          first_name: userData.user.user_metadata?.first_name || '',
          last_name: userData.user.user_metadata?.last_name || '',
          role: (userData.user.user_metadata?.role as UserRole) || 'user',
          verification_status: 'pending',
          email_notifications: true,
          sms_notifications: false,
          marketing_emails: false
          // Note: full_name will be automatically generated from first_name + last_name
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ User profile created:', data.role);
      return data;
      
    } catch (error) {
      console.error('❌ Failed to create profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const updatedProfile = await fetchUserProfile(user.id);
      setProfile(updatedProfile);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    console.log('🔍 Starting sign in for:', email);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        return { error };
      }

      console.log('✅ Sign in successful');
      return { error: null };
      
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: SignUpData = {}) => {
    console.log('🔍 Starting sign up for:', email);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName || '',
            last_name: userData.lastName || '',
            role: userData.role || 'user',
            agency_name: userData.agencyName || '',
            license_number: userData.licenseNumber || ''
          }
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        return { error };
      }

      console.log('✅ Sign up successful');
      return { error: null };
      
    } catch (error) {
      console.error('❌ Sign up failed:', error);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    console.log('🚪 Signing out...');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      console.log('✅ Signed out successfully');
      
    } catch (error) {
      console.error('❌ Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle auth state changes
  useEffect(() => {
    let isMounted = true;
    
    // Fetch user profile with rate limiting
    const fetchUserProfileForEffect = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
      if (profileLoading && retryCount === 0) {
        console.log('⏳ Profile fetch already in progress, skipping...');
        return null;
      }

      setProfileLoading(true);
      
      try {
        console.log('👤 Fetching user profile for:', userId);
        
        // Add delay to prevent rate limiting
        if (retryCount > 0) {
          const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
          console.log(`⏳ Waiting ${delay}ms before retry ${retryCount}...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('❌ Profile fetch error:', error);
          
          // Retry on certain errors
          if (error.code === '23503' && retryCount < 3) {
            console.log(`🔄 Retrying profile fetch (attempt ${retryCount + 1})`);
            return await fetchUserProfileForEffect(userId, retryCount + 1);
          }
          
          // If no profile exists, create one
          if (error.code === 'PGRST116' || error.message.includes('No rows')) {
            console.log('🔨 Creating missing user profile...');
            return await createUserProfile(userId);
          }
          
          throw error;
        }

        console.log('✅ Profile fetched successfully:', data.role);
        setProfile(data); // This line was missing!
        return data;
        
      } catch (error) {
        console.error('💥 Profile fetch failed:', error);
        return null;
      } finally {
        setProfileLoading(false);
      }
    };
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (session?.user) {
            console.log('👤 Initial session found:', session.user.email);
            setUser(session.user);
            
            // Fetch profile with delay to prevent rate limiting
            setTimeout(async () => {
              if (isMounted) {
                const userProfile = await fetchUserProfileForEffect(session.user.id);
                if (isMounted) {
                  setProfile(userProfile);
                }
              }
            }, 500);
          } else {
            console.log('👤 No initial session');
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Session error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 Auth state changed:', event);
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch profile with delay
          setTimeout(async () => {
            if (isMounted) {
              const userProfile = await fetchUserProfileForEffect(session.user.id);
              if (isMounted) {
                setProfile(userProfile);
              }
            }
          }, 1000);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [profileLoading]); // Added missing dependency

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
