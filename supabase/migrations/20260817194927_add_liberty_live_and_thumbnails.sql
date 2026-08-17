-- Adds "Liberty Live" (the video already featured in the homepage
-- carousel — verified via its full caption: Fri Aug 21, 6-9pm, 8212
-- Liberty Road, hosted by @greaterrandallstowncdo) to the events
-- calendar, and attaches thumbnail screenshots — stored in the
-- event-media bucket — to the events seeded earlier, so the /events
-- grid renders fast local images instead of hitting Instagram at
-- request time.
--
-- No thumbnail set for "Community Art Night Meet Up": the only visual
-- frame available from that post is a personal mid-sentence closeup of
-- the creator, not a flyer graphic, so it keeps the icon-tile fallback
-- rather than using someone's likeness out of context.

INSERT INTO public.community_events (title, event_date, event_time, location, media_type, source, url, image_url, sort_order) VALUES
  ('Liberty Live: Last One! (Summer Finale)', '2026-08-21', '6:00 – 9:00 PM', '8212 Liberty Road (former Ollie''s/Shoppers), Randallstown, MD', 'video', 'Instagram · @greaterrandallstowncdo', 'https://www.instagram.com/reel/DcGrAdDRDi0/', 'https://sldlxxcyhgccattpllqm.supabase.co/storage/v1/object/public/event-media/liberty-live.jpg', 0);

UPDATE public.community_events SET image_url = 'https://sldlxxcyhgccattpllqm.supabase.co/storage/v1/object/public/event-media/kiki-cookout.jpg'
  WHERE url = 'https://www.instagram.com/p/DbldJvkuHkm/';

UPDATE public.community_events SET image_url = 'https://sldlxxcyhgccattpllqm.supabase.co/storage/v1/object/public/event-media/kollective-deltas.jpg', source = 'Instagram · @gbenightlife'
  WHERE url = 'https://www.instagram.com/p/Db3wUxSMulI/';

UPDATE public.community_events SET image_url = 'https://sldlxxcyhgccattpllqm.supabase.co/storage/v1/object/public/event-media/top-of-morning-fest.jpg'
  WHERE url = 'https://www.instagram.com/p/DadUIHxtscA/';

UPDATE public.community_events SET image_url = 'https://sldlxxcyhgccattpllqm.supabase.co/storage/v1/object/public/event-media/backpack-giveaway.jpg', source = 'DSD Legacy Foundation via BmoreConnect'
  WHERE url LIKE '%free-backpacks-and-school-supplies%';
