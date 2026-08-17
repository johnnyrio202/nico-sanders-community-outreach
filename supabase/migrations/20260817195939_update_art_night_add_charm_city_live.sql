-- Community Art Night Meet Up: swaps the personal-video link for the
-- event's own page on blyssbaltimore.com, which has real flyer artwork
-- and states plainly that registration has closed — more honest than
-- routing visitors to an Instagram video with no such notice. Media
-- type changes to 'listing' so the card reads "View Event Details"
-- instead of a now-inaccurate "Watch on Instagram".
--
-- Adds Charm City Live (Boyz II Men, Estelle, Case) — a free,
-- city-affiliated Labor Day Weekend concert at War Memorial Plaza,
-- found via the same Instagram search and verified by opening the post
-- directly (backed by the Mayor's Office of Arts, Culture &
-- Entertainment, Baltimore City Rec & Parks, Downtown Partnership, and
-- the Baltimore Development Corporation per the flyer's own credits).

UPDATE public.community_events
SET
  url = 'https://www.blyssbaltimore.com/event-details/community-art-night-meet-up',
  image_url = 'https://sldlxxcyhgccattpllqm.supabase.co/storage/v1/object/public/event-media/community-art-night.jpg',
  media_type = 'listing',
  location = 'Empact Art, Inc, 3601 Clipper Mill Rd, Baltimore, MD 21211'
WHERE url = 'https://www.instagram.com/p/Db1oMbTIdWJ/';

INSERT INTO public.community_events (title, event_date, event_time, location, media_type, source, url, image_url, sort_order) VALUES
  ('Charm City Live: Boyz II Men, Estelle, Case', '2026-09-05', '12:00 – 9:00 PM', 'War Memorial Plaza, Baltimore, MD', 'flyer', 'Instagram · @bmoreculture', 'https://www.instagram.com/p/Db9AujWiAVZ/', 'https://sldlxxcyhgccattpllqm.supabase.co/storage/v1/object/public/event-media/charm-city-live.jpg', 6);
