-- Fills gaps found on a full re-read of the District 4 Community News Bulletin PDF
-- against what was actually published — several genuinely relevant items were
-- missed in the first two passes. URLs verified via web search, not guessed.

INSERT INTO public.resources (category, title, description, url, phone, sort_order) VALUES
  ('Local Events', 'Liberty Live Concert Series', 'Free outdoor concerts along the Liberty Rd corridor from GRCDO. Fridays June 26, July 24, and August 21, 6–9pm, at 8212 Liberty Road, Windsor Mill.', 'https://grcdo.org/liberty-live', NULL, 5),

  ('Community Organizations', 'Reisterstown Recreation and Parks Council', 'Recreation programs, activities, and community events for the Reisterstown area.', 'https://www.reisterstownrec.com/', NULL, 5),
  ('Community Organizations', 'Northwest Chamber of Commerce', 'Serves the Reisterstown, Owings Mills, Randallstown, and Pikesville business community; hosts the Owings Mills Farmers Market and Annual Crab Feast.', 'https://northwestchambermd.com/', NULL, 6),
  ('Community Organizations', 'Baltimore County Community & Business Associations Directory', 'Official county directory to find and connect with community and business associations across Baltimore County.', 'https://www.baltimorecountymd.gov/departments/planning/community-planning/community-associations', NULL, 7),

  ('Good Government', 'Zoning & Development Hearings Calendar', 'Schedule of upcoming Baltimore County zoning and development hearings, including those affecting our neighborhoods.', 'https://www.baltimorecountymd.gov/departments/adminhearings/zoning-dev-hearings', NULL, 7),
  ('Good Government', 'Baltimore County BUILDS', 'County initiative making the permitting process clearer and faster for residents, developers, and business owners.', 'https://www.baltimorecountymd.gov/departments/county-executive/news/baltimore-county-update-development-and-permitting-process', NULL, 8),

  ('Small Business & Economy', 'CCBC Center for Business Innovation and Trades', 'Business planning, startup guidance, workshops, and training for entrepreneurs through Community College of Baltimore County.', 'https://www.ccbcmd.edu/Programs-and-Courses/SBTL/CBI/index.html', NULL, 3),

  ('Schools & Opportunity', 'Baltimore County Recreation & Parks Jobs and Volunteering', 'Full-time, part-time, and volunteer openings with Baltimore County''s Department of Recreation and Parks.', 'https://www.baltimorecountymd.gov/departments/recreation/jobs-volunteers', NULL, 4),

  ('Environment & Infrastructure', 'SHA Project Portal', 'Look up current, funded, and planned Maryland road projects near you, including maps, schedules, and public meetings.', 'https://mdot-sha-project-portal-maryland.hub.arcgis.com/', NULL, 3),

  ('Grants & Scholarships', 'Maryland State Arts Council', 'Grants supporting arts programs, artists, and cultural organizations across Maryland.', 'https://msac.org/', NULL, 5);
