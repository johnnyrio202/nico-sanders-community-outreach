-- Adds event categories and a funding table (grants, scholarships, jobs).
-- Every funding row must have a real source URL (url NOT NULL).
ALTER TABLE community_events ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE community_events ADD COLUMN IF NOT EXISTS description TEXT;

CREATE TABLE IF NOT EXISTS funding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('Grant','Scholarship','Jobs')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  audience TEXT NOT NULL,
  deadline DATE,
  note TEXT,
  url TEXT NOT NULL,
  source TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
