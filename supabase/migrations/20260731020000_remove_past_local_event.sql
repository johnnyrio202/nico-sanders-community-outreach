-- Cops & Kids Basketball Camp (July 27-31) has passed; remove from Local Events.
DELETE FROM public.resources
WHERE category = 'Local Events' AND title = 'Cops & Kids Basketball Camp';
