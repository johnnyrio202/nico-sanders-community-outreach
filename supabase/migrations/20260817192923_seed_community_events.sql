-- First curated batch for the /events calendar page. Sourced from Nico's
-- own Instagram search (verified by opening each post directly) plus
-- bmoreconnect.org's community calendar, scoped to what's still upcoming
-- as of August 17, 2026. Excluded on purpose: several posts surfaced by
-- the same Instagram search had already passed (R&B on the Water Aug 15,
-- the DMV Caribbean & Soul Food Festival Aug 16, the Juneteenth boaters
-- weekend) or had no verifiable date ("Fells Point Link Up: TODAY").

ALTER TABLE public.community_events
  DROP CONSTRAINT IF EXISTS community_events_media_type_check;
ALTER TABLE public.community_events
  ADD CONSTRAINT community_events_media_type_check
  CHECK (media_type IN ('flyer', 'video', 'listing'));

INSERT INTO public.community_events (title, event_date, event_time, location, media_type, source, url, sort_order) VALUES
  ('Community Art Night Meet Up', '2026-08-19', '6:00 PM', 'Empact Art, Baltimore', 'video', 'Instagram · @blysssocialclub', 'https://www.instagram.com/p/Db1oMbTIdWJ/', 1),
  ('Free Backpacks & School Supplies Giveaway', '2026-08-22', '10:00 AM – 12:00 PM', 'Randallstown High School, 4000 Offutt Rd, Randallstown, MD', 'listing', 'BmoreConnect', 'https://www.bmoreconnect.org/upcomingbaltimoreevents/free-backpacks-and-school-supplies-giveaway-randallstown', 2),
  ('Baltimore Kiki Cookout / Kiki Ball', '2026-08-22', '3:00 – 8:00 PM', 'The Pride Center of Maryland, 2418 Saint Paul St, Baltimore, MD 21218', 'flyer', 'Instagram · @pridecenterofmd', 'https://www.instagram.com/p/DbldJvkuHkm/', 3),
  ('The Kollective Welcomes the Deltas to Baltimore', '2026-08-28', '9:00 PM', 'Club Safari, 5625 O''Donnell St, Baltimore, MD 21224', 'flyer', 'Instagram', 'https://www.instagram.com/p/Db3wUxSMulI/', 4),
  ('Top of the Morning Fest', '2026-09-05', '9:00 AM – 2:00 PM', 'Power Plant Live, 34 Market Pl, Baltimore, MD 21202', 'flyer', 'Instagram · @topofthemorningfestival', 'https://www.instagram.com/p/DadUIHxtscA/', 5);
