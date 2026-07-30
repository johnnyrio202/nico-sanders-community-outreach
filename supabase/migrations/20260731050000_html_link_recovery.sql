-- Re-checked the bulletin's raw HTML (not just the PDF) so we could resolve
-- items that had no visible URL in the PDF export. Several Cisco Secure Web
-- redirect links have since expired (404), but a few links were direct and
-- resolved cleanly. Greater Patapsco Community Association was also checked
-- and confirmed out of area (serves Granite/Woodstock, not District 11A), so
-- it stays excluded despite now having a working link.

INSERT INTO public.resources (category, title, description, url, phone, sort_order) VALUES
  ('Community Organizations', 'Senior Centers and Wellness Programs', 'Baltimore County''s Department of Aging operates senior centers and wellness programs across the county, including locations in our area.', 'https://www.baltimorecountymd.gov/departments/aging/centers?page=0', NULL, 8),
  ('Community Organizations', 'Reisterstown Owings Mills Glyndon Coordinating Council', 'Coordinating council connecting community associations and civic groups across Reisterstown, Owings Mills, and Glyndon.', 'https://sites.google.com/view/rog-coordinating-council/home', NULL, 9),

  ('Small Business & Economy', 'GRCDO Business Networking Series', '2026 Business Networking Series from the Greater Randallstown Community Development Organization — workshops on strengthening operations and building resilience for entrepreneurs and small business owners.', 'https://grcdo.org/business-networking/', NULL, 4),

  ('Grants & Scholarships', 'Outdoor Recreation Legacy Partnership Program', 'Federal 50/50 matching grant (up to $15,000,000) for outdoor recreation space in areas with a population of 25,000 or more. Federal applications due November 1.', 'https://www.nps.gov/subjects/lwcf/orlp.htm', NULL, 6);
