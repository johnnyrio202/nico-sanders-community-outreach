-- New Supabase project setup (replacing the Lovable Cloud-managed
-- project kheqibctakoejwobnmig). The original three form tables
-- (volunteer_signups, campaign_joins, contact_messages) already exist
-- via the earlier migration in this repo, which ran first and carried
-- over correct insert-only RLS. This migration only adds the new
-- `resources` table that powers the dynamic "Resources for our
-- community" section.

-- ── resources table ──────────────────────────────────────────────

CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  phone TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Public read-only: anyone can view resources, but only the
-- service_role key (used from the dashboard / admin scripts, never
-- shipped client-side) can insert, update, or delete entries.
CREATE POLICY "Anyone can view resources"
  ON public.resources FOR SELECT
  USING (true);

-- Seed data: verified Baltimore County / Maryland resources for
-- District 11A residents, grouped under the six existing category
-- headings so the frontend can match on `category` directly.
INSERT INTO public.resources (category, title, description, url, phone, sort_order) VALUES
  ('Housing & Cost of Living', '211 Maryland', 'Call 211 or visit online to get connected to housing, rental assistance, and utility help programs across Maryland.', 'https://211md.org/resources/utility-assistance/', '211', 1),
  ('Housing & Cost of Living', 'Maryland Office of Home Energy Programs', 'State assistance with heating and electric bills, including help with past-due balances.', 'https://dhs.maryland.gov/office-of-home-energy-programs/', '1-800-786-2000', 2),
  ('Housing & Cost of Living', 'Fuel Fund of Maryland', 'Emergency utility assistance for households facing a shutoff or unaffordable energy bill.', 'https://fuelfundmaryland.org/apply', NULL, 3),

  ('Mental Health & Safety', '988 Suicide & Crisis Lifeline', 'Call or text 988 anytime for free, confidential crisis support.', 'https://988helpline.org/', '988', 1),
  ('Mental Health & Safety', 'Grassroots Crisis Intervention Center', '24-hour crisis, substance use, and housing support serving Baltimore County residents. Walk-ins welcome.', 'https://grassrootscrisis.org/', '410-531-6677', 2),
  ('Mental Health & Safety', 'Baltimore County Crisis Response (BCCRS)', 'Mobile Crisis Team pairing Baltimore County Police and Health departments for in-person mental health crisis response.', 'https://www.baltimorecountymd.gov/departments/police/behavioral-assessment', NULL, 3),

  ('Schools & Opportunity', 'Baltimore County Public Schools', 'Information on enrollment, family resources, and support services for BCPS students and families.', 'https://www.bcps.org/', NULL, 1),
  ('Schools & Opportunity', 'Baltimore County Office of Employment & Training', 'Job training, on-the-job training, and skills programs for county residents.', 'https://www.baltimorecountymd.gov/departments/economic-and-workforce-development/job-opportunities', NULL, 2),
  ('Schools & Opportunity', 'Maryland Apprenticeship & Training Program', 'State-registered apprenticeship opportunities across construction, manufacturing, and other trades.', 'https://labor.maryland.gov/employment/appr/', NULL, 3),

  ('Good Government', 'Baltimore County 311', 'Report non-emergency issues (downed trees, road debris, malfunctioning signals) and reach county services by phone or app.', 'https://www.baltimorecountymd.gov/', '311', 1),
  ('Good Government', '211 Maryland', 'A single number to get connected to the right state or local government program for your situation.', 'https://211md.org/', '211', 2),

  ('Small Business & Economy', 'Baltimore County Economic & Workforce Development', 'Business support including site selection, financing guidance, and workforce partnerships for local entrepreneurs.', 'https://www.baltimorecountymd.gov/departments/economic-and-workforce-development/business', NULL, 1),
  ('Small Business & Economy', 'U.S. Small Business Administration – Baltimore District', 'Federal SBA resources, loans, and counseling for small business owners in the Baltimore region.', 'https://www.sba.gov/district/baltimore', NULL, 2),

  ('Environment & Infrastructure', 'BaltCo Alert', 'Sign up for Baltimore County emergency alerts, including severe weather and hazard notifications by phone, text, or email.', 'https://www.baltimorecountymd.gov/departments/emergency-management/alerts', NULL, 1),
  ('Environment & Infrastructure', 'Baltimore County 311', 'Report stormwater, road, and infrastructure issues directly to the county.', 'https://www.baltimorecountymd.gov/', '311', 2);
