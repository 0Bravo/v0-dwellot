'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestConnectionPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: string[] = [];
    
    try {
      // Test 1: Basic connection
      results.push('🔍 Testing Supabase connection...');
      
      // Test 2: Environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      results.push(`📍 Supabase URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
      results.push(`🔑 Supabase Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
      
      if (!supabaseUrl || !supabaseKey) {
        results.push('❌ Environment variables are missing!');
        setTestResults([...results]);
        return;
      }
      
      // Test 3: Check auth connection
      const { error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        results.push(`❌ Auth session error: ${sessionError.message}`);
      } else {
        results.push('✅ Auth connection successful');
      }
      
      // Test 4: Check database connection
      const { error: profilesError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
        
      if (profilesError) {
        results.push(`❌ Database error: ${profilesError.message}`);
        results.push(`💡 This usually means your database schema isn't set up`);
      } else {
        results.push('✅ Database connection successful');
      }
      
      // Test 5: Try a simple signup
      results.push('🔍 Testing signup process...');
      const testEmail = `test-${Date.now()}@example.com`;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User',
            role: 'user'
          }
        }
      });
      
      if (signUpError) {
        results.push(`❌ Signup error: ${signUpError.message}`);
      } else {
        results.push('✅ Signup process works');
        // Clean up test user if needed
        if (signUpData.user) {
          results.push('✅ Test user created successfully');
        }
      }
      
    } catch (error) {
      results.push(`💥 Unexpected error: ${error}`);
    } finally {
      setLoading(false);
      setTestResults(results);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🔧 Supabase Connection Test</h1>
          
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-4"
            >
              {loading ? '🔄 Running Tests...' : '🧪 Run Connection Tests'}
            </button>
            
            <button
              onClick={clearResults}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              🗑️ Clear Results
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <p className="mb-2"><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click &quot;Run Connection Tests&quot; to diagnose issues</li>
              <li>Check all tests pass (✅)</li>
              <li>If any fail (❌), fix those issues first</li>
              <li>Once all pass, your authentication should work</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
