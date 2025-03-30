/*
  # Initial Schema Setup for Condominium App

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - full_name (text)
      - pin (text)
      - role (text)
      - created_at (timestamptz)
    
    - notifications
      - id (uuid, primary key)
      - type (text)
      - title (text)
      - description (text)
      - priority (text)
      - created_at (timestamptz)
      - created_by (uuid, references users)
    
    - access_logs
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - type (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  pin text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('message', 'event', 'incident')),
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('high', 'normal')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id) NOT NULL
);

-- Create access_logs table
CREATE TABLE IF NOT EXISTS access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('entry', 'exit')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Notifications policies
CREATE POLICY "All users can read notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Access logs policies
CREATE POLICY "Users can read own access logs"
  ON access_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own access logs"
  ON access_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());