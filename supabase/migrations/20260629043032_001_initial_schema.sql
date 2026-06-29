-- AI Police Platform Initial Schema

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'investigator',
  organization text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Investigations table
CREATE TABLE IF NOT EXISTS investigations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text,
  description text,
  status text NOT NULL DEFAULT 'pending',
  progress integer NOT NULL DEFAULT 0,
  priority text NOT NULL DEFAULT 'normal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "users_select_own" ON users FOR SELECT TO authenticated USING (auth.uid() = auth_user_id);
CREATE POLICY "users_insert_own" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = auth_user_id);
CREATE POLICY "users_update_own" ON users FOR UPDATE TO authenticated USING (auth.uid() = auth_user_id);

-- Investigations policies
CREATE POLICY "investigations_select_own" ON investigations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "investigations_insert_own" ON investigations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "investigations_update_own" ON investigations FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "investigations_delete_own" ON investigations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_investigations_user_id ON investigations(user_id);
CREATE INDEX IF NOT EXISTS idx_investigations_case_id ON investigations(case_id);