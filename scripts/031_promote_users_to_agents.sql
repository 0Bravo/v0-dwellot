-- Update all existing users to be agents so they can add properties
UPDATE profiles
SET role = 'agent'
WHERE role = 'user';

-- Ensure the current user (if any) is an agent
-- This is a broad update to ensure testing works smoothly
