-- Follow-up to 20260730000000: restores two date-driven items the
-- first pass excluded as "likely stale by launch" (client confirmed
-- it's fine to publish near-term/date-driven items now), and adds a
-- Good Government item clarifying that Baltimore County Council
-- District 4 — not "District 11A" — is the county-level district
-- covering this same area (11A is a separate, state-legislative
-- district; the two numbering systems aren't related).

INSERT INTO public.resources (category, title, description, url, phone, sort_order) VALUES
  ('Good Government', 'Baltimore County Council — District 4', 'The county-level council district covering Reisterstown, Owings Mills, and Randallstown (a different system from state House District 11A, but the same neighborhoods).', 'https://countycouncil.baltimorecountymd.gov/district-4/', '410-887-3389', 3),
  ('Grants & Scholarships', 'State Revitalization Programs', 'State funding for projects within Reisterstown Main Street and Northwest Gateways, our district''s two Sustainable Community Plan areas. FY28 application round closes August 6.', 'https://projectportal.dhcd.state.md.us/', NULL, 4),
  ('Local Events', 'Cops & Kids Basketball Camp', 'Free basketball camp for kids ages 5–17 hosted by Baltimore County Police, July 27–31, 8:30am–2pm daily. Registration at the door.', NULL, '410-887-5165', 5);
