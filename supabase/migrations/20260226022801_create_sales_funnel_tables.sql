/*
  # Sales Funnel Database Schema

  1. New Tables
    - `lead_captures`
      - `id` (uuid, primary key)
      - `name` (text, required) - Lead's full name
      - `whatsapp` (text, required) - WhatsApp number
      - `budget` (text, required) - Investment budget range
      - `lead_magnet` (text) - Which lead magnet they downloaded
      - `created_at` (timestamptz) - Timestamp of capture
      
    - `fomo_notifications`
      - `id` (uuid, primary key)
      - `message` (text, required) - Notification message
      - `location` (text) - Property location mentioned
      - `notification_type` (text) - Type: 'inquiry', 'sale', 'viewing'
      - `is_active` (boolean) - Whether to show in ticker
      - `created_at` (timestamptz) - Timestamp
      
  2. Security
    - Enable RLS on both tables
    - Public read access for fomo_notifications (marketing content)
    - Authenticated write access for lead_captures
    - Service role access for managing notifications

  3. Important Notes
    - Lead captures are restricted - only admins can view
    - FOMO notifications are public for marketing purposes
    - Default sample notifications included for immediate use
*/

-- Lead Captures Table
CREATE TABLE IF NOT EXISTS lead_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  whatsapp text NOT NULL,
  budget text NOT NULL,
  lead_magnet text DEFAULT 'Silicon Beach Investment Report 2026',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can view leads
CREATE POLICY "Service role can manage lead captures"
  ON lead_captures
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert leads (for form submissions)
CREATE POLICY "Anyone can submit lead capture"
  ON lead_captures
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- FOMO Notifications Table
CREATE TABLE IF NOT EXISTS fomo_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  location text,
  notification_type text DEFAULT 'inquiry',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fomo_notifications ENABLE ROW LEVEL SECURITY;

-- Public read access for notifications
CREATE POLICY "Anyone can view active notifications"
  ON fomo_notifications
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Service role can manage notifications
CREATE POLICY "Service role can manage notifications"
  ON fomo_notifications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert sample FOMO notifications
INSERT INTO fomo_notifications (message, location, notification_type, is_active) VALUES
  ('New NRI inquiry from Dubai for Kadri Heights', 'Kadri', 'inquiry', true),
  ('3 units sold in Bejai this week', 'Bejai', 'sale', true),
  ('Investment banker from Bangalore viewing Derebail properties', 'Derebail', 'viewing', true),
  ('Family from Kuwait booked 3BHK in Pandeshwar', 'Pandeshwar', 'sale', true),
  ('Tech professional inquired about IT Park vicinity properties', 'Derebail IT Park', 'inquiry', true),
  ('2 luxury villas reserved in Ullal Beach Road', 'Ullal', 'sale', true),
  ('NRI couple from USA viewing Kadri properties this weekend', 'Kadri', 'viewing', true);
