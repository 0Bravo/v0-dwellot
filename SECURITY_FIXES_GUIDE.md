# Security Fixes Guide

## Overview
This document explains the security issues found in the Supabase database and how to fix them.

## Issues Found

### 1. Function Search Path Mutable (4 Functions)
**Severity**: WARN  
**Risk**: Search path hijacking vulnerability

**Affected Functions:**
- `update_updated_at_column`
- `handle_updated_at`
- `update_property_view_count`
- `increment_view_count`

**Problem**: These functions don't have a secure `search_path` set, making them vulnerable to search path manipulation attacks.

**Fix Applied**: Added `SET search_path = public, pg_temp` to all functions.

---

### 2. RLS Policy Always True (3 Policies)
**Severity**: WARN  
**Risk**: Unrestricted data insertion, potential spam/abuse

**Affected Tables:**
- `inquiries` - `inquiries_insert_all` policy
- `newsletter_subscribers` - `Anyone can subscribe to newsletter` policy
- `property_views` - `property_views_insert_all` policy

**Problem**: These policies use `WITH CHECK (true)` which allows unrestricted INSERT operations.

**Fixes Applied**:
1. **inquiries**: 
   - Split into two policies: one for authenticated users (must own the inquiry), one for anonymous users (requires valid email, name, message)
   
2. **newsletter_subscribers**: 
   - Added email format validation
   - Added unique constraint to prevent duplicate subscriptions
   
3. **property_views**: 
   - Added validation to ensure property exists before logging view

---

### 3. Auth Leaked Password Protection Disabled
**Severity**: WARN  
**Risk**: Users can use compromised passwords

**Problem**: Supabase Auth is not checking passwords against HaveIBeenPwned.org

**Fix**: This must be enabled in Supabase Dashboard (cannot be done via SQL)

**Manual Steps Required:**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Find **Password Security** section
4. Enable **Leaked Password Protection**

---

## How to Apply Fixes

### Step 1: Run the Migration Script
```bash
# In Supabase SQL Editor or via CLI
psql -h <your-db-host> -U postgres -d postgres -f scripts/042_fix_security_warnings.sql
```

Or in Supabase Dashboard:
1. Go to **SQL Editor**
2. Create new query
3. Copy contents of `scripts/042_fix_security_warnings.sql`
4. Run the script

### Step 2: Enable Leaked Password Protection (Manual)
1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Settings**
4. Scroll to **Password Security**
5. Toggle on **Leaked Password Protection**

### Step 3: Verify Fixes
Run these queries to verify the fixes were applied:

```sql
-- Check functions have secure search_path
SELECT 
    proname as function_name,
    prosecdef as security_definer,
    prosrc as source_code
FROM pg_proc 
WHERE proname IN (
    'update_updated_at_column', 
    'handle_updated_at', 
    'update_property_view_count', 
    'increment_view_count'
);

-- Check RLS policies
SELECT 
    tablename,
    policyname,
    cmd as command,
    qual as using_clause,
    with_check
FROM pg_policies 
WHERE tablename IN ('inquiries', 'newsletter_subscribers', 'property_views')
ORDER BY tablename, policyname;

-- Check constraints
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid::regclass::text IN ('inquiries', 'newsletter_subscribers')
    AND contype = 'c';
```

---

## Additional Security Improvements

### Rate Limiting Table
A `rate_limit_log` table has been created to help track and prevent abuse. You can implement rate limiting logic in your API routes by checking this table before allowing operations.

Example usage:
```typescript
// Check if user has exceeded rate limit
const recentAttempts = await supabase
  .from('rate_limit_log')
  .select('*')
  .eq('table_name', 'inquiries')
  .eq('identifier', email)
  .gte('created_at', new Date(Date.now() - 3600000).toISOString()); // Last hour

if (recentAttempts.data && recentAttempts.data.length > 5) {
  throw new Error('Too many requests. Please try again later.');
}
```

### Input Validation
The following constraints have been added:
- Email format validation for `inquiries` and `newsletter_subscribers`
- NOT NULL constraints on required fields
- Unique index on newsletter subscriber emails (case-insensitive)

---

## Testing After Fixes

### Test 1: Verify Functions Work
```sql
-- Test view count increment
SELECT increment_view_count('some-valid-property-uuid');

-- Verify it incremented
SELECT id, title, view_count FROM properties WHERE id = 'some-valid-property-uuid';
```

### Test 2: Verify RLS Policies Work
```sql
-- Try to insert invalid inquiry (should fail)
INSERT INTO inquiries (name, email, message, property_id)
VALUES ('Test', 'invalid-email', 'Test message', NULL);
-- Expected: ERROR constraint violation

-- Try valid inquiry (should succeed)
INSERT INTO inquiries (name, email, message, property_id)
VALUES ('John Doe', 'john@example.com', 'Test message', 'valid-property-uuid');
-- Expected: Success
```

### Test 3: Verify Newsletter Validation
```sql
-- Try invalid email (should fail)
INSERT INTO newsletter_subscribers (email)
VALUES ('not-an-email');
-- Expected: ERROR constraint violation

-- Try valid email (should succeed)
INSERT INTO newsletter_subscribers (email)
VALUES ('subscriber@example.com');
-- Expected: Success

-- Try duplicate (should fail)
INSERT INTO newsletter_subscribers (email)
VALUES ('subscriber@example.com');
-- Expected: ERROR unique constraint violation
```

---

## Monitoring

After applying these fixes, monitor your database for:

1. **Failed INSERT attempts** - Check Supabase logs for RLS policy violations
2. **Function execution** - Verify triggers are firing correctly
3. **Rate limiting** - Review `rate_limit_log` table periodically

To clean up old rate limit logs automatically, you can set up a cron job or use Supabase's pg_cron extension:

```sql
-- Run daily cleanup at 2 AM
SELECT cron.schedule(
    'cleanup-rate-limits',
    '0 2 * * *',
    $$SELECT cleanup_rate_limit_logs()$$
);
```

---

## Questions?

If you encounter any issues after applying these fixes:
1. Check Supabase logs for detailed error messages
2. Verify all migrations ran successfully
3. Test each policy individually
4. Review the verification queries output

For more information, refer to:
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Function Security](https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY)
