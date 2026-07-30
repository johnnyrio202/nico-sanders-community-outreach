-- Adds three new resource categories sourced from the Baltimore County
-- Dept. of Planning's District 4 Community News Bulletin (shared by
-- Nico, forwarded from Yolanda Gregory / Carla Nelson Chambers), scoped
-- to items genuinely relevant to District 11A (Reisterstown / Owings
-- Mills / Randallstown area) with real, verified links.
--
-- Excluded on purpose: items already expired or with unreliable dates
-- (e.g. the bulletin lists "Councilman Jones Community Festival" as
-- August 29, 2027, which looks like a typo and wasn't safe to publish),
-- and items tied to Baltimore County Council District 4 specifically
-- (a different, overlapping-but-distinct governance boundary from
-- Maryland's state-legislative District 11A).

INSERT INTO public.resources (category, title, description, url, phone, sort_order) VALUES
  ('Local Events', 'Music on Main Street', 'Live music in downtown Reisterstown, Fridays through August 21, 6:30–9:30pm at Franklin Middle School.', 'https://www.reisterstown.com/', NULL, 1),
  ('Local Events', 'National Night Out', 'Baltimore County''s annual block-party-style event with cookouts, movies, and face painting, building ties between neighbors and local police. Tuesday, August 4.', 'https://www.baltimorecountymd.gov/departments/police/news/national-night-out-2026-baltimore-county', NULL, 2),
  ('Local Events', 'Foundry Row Summer Concerts', 'Free outdoor concert series in Owings Mills, Thursday evenings through August 13, 6:30–8:00pm.', 'https://www.visitfoundryrow.com/events/summerconcerts/', NULL, 3),
  ('Local Events', 'Reisterstown Farmers Market', 'Local produce and vendors on Main Street every Sunday, 9am–1pm, through September 27.', 'https://www.reisterstown.com/', NULL, 4),

  ('Grants & Scholarships', 'District 10 & 11A Legislative Scholarships', 'State college financial aid scholarships set aside specifically for students in District 10 and District 11A. Apply through MDCAPS.', 'https://mdcaps.mhec.state.md.us/MDCAPS/', NULL, 1),
  ('Grants & Scholarships', 'Maryland Small Business Direct Loans', 'Low-interest loans from the Maryland Dept. of Housing and Community Development to help small businesses access capital. First application round opens August 17.', 'https://dhcd.maryland.gov/business', NULL, 2),
  ('Grants & Scholarships', 'Greenspace Equity Program', 'State grants for community green space projects, prioritizing historically underserved areas. Applications due September 1.', 'https://dnr.maryland.gov/land/Pages/Greenspace-Equity-Program.aspx', NULL, 3),

  ('Community Organizations', 'Greater Randallstown Community Development Organization', 'Business networking, the Liberty Live concert series, and community development programs for the Randallstown corridor.', 'https://grcdo.org/', NULL, 1),
  ('Community Organizations', 'Reisterstown Improvement Association', 'Main Street events, the farmers market, and local business promotion for downtown Reisterstown.', 'https://www.reisterstown.com/', NULL, 2),
  ('Community Organizations', 'Randallstown NAACP', 'Community organizing, advocacy, and events for the Randallstown area.', 'https://randnaacp.org/events/', NULL, 3),
  ('Community Organizations', 'Baltimore County Public Library', 'Branches in Randallstown, Owings Mills, and Reisterstown offer free programs, resources, and event space for residents.', 'https://www.bcpl.info/locations', NULL, 4);
