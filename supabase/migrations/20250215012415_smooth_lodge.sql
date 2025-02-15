/*
  # Initial Schema for Hackathon Hub

  1. New Tables
    - `announcements`
      - `id` (uuid, primary key)
      - `content` (text)
      - `author` (text)
      - `created_at` (timestamp)
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `members` (uuid array)
      - `created_at` (timestamp)
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `github_url` (text)
      - `tech_stack` (text array)
      - `team_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  author text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read announcements"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create announcements"
  ON announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  members uuid[] DEFAULT ARRAY[]::uuid[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Team members can update their team"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = ANY(members))
  WITH CHECK (auth.uid() = ANY(members));

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  github_url text NOT NULL,
  tech_stack text[] DEFAULT ARRAY[]::text[],
  team_id uuid REFERENCES teams(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team members can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE auth.uid() = ANY(members)
    )
  );

CREATE POLICY "Team members can update their projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams
      WHERE auth.uid() = ANY(members)
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams
      WHERE auth.uid() = ANY(members)
    )
  );