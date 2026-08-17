-- Public storage bucket for community-event thumbnail screenshots
-- (flyer/video preview images), so the /events grid can render fast
-- local thumbnails instead of fetching from Instagram at request time.

INSERT INTO storage.buckets (id, name, public)
VALUES ('event-media', 'event-media', true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.community_events
  ADD COLUMN IF NOT EXISTS image_url TEXT;
