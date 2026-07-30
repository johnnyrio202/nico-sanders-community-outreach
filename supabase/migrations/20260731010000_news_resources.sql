-- Adds state-policy and hyperlocal news sources under Good Government,
-- per request: "Good government could be state level policies that
-- will impact the greater baltimore communities as well... state
-- legislative news from Annapolis or local news outlets."

INSERT INTO public.resources (category, title, description, url, phone, sort_order) VALUES
  ('Good Government', 'Maryland Matters', 'Nonpartisan, nonprofit news coverage of the Maryland General Assembly and state policy from Annapolis — bills, budget fights, and legislation that affects Baltimore County.', 'https://marylandmatters.org/', NULL, 4),
  ('Good Government', 'Northwest Voice', 'Hyperlocal news covering Owings Mills, Pikesville, Randallstown, Reisterstown, Windsor Mill, and Woodlawn.', 'https://nwvoicenews.com/', NULL, 5),
  ('Good Government', 'Maryland General Assembly', 'Track active bills, committee schedules, and find your state legislators directly from the official Annapolis source.', 'https://mgaleg.maryland.gov/', NULL, 6);
