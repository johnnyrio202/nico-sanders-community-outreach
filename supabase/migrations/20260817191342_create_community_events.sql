-- Powers the new /events calendar page: a curated grid of upcoming
-- Baltimore-area community events, each linking out to its original
-- Instagram post (flyer or video) or ticket page rather than rehosting
-- any organizer's promotional artwork.

CREATE TABLE public.community_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  location TEXT,
  media_type TEXT NOT NULL DEFAULT 'flyer' CHECK (media_type IN ('flyer', 'video')),
  source TEXT,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;

-- Public read-only: anyone can view events, but only the service_role
-- key (dashboard / admin scripts, never shipped client-side) can
-- insert, update, or delete entries.
CREATE POLICY "Anyone can view community events"
  ON public.community_events FOR SELECT
  USING (true);
