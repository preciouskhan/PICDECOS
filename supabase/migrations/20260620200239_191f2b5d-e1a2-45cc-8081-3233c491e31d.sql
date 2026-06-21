
CREATE POLICY "Public read site-media" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');
CREATE POLICY "Public read site-documents" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-documents');
CREATE POLICY "Admins upload site-media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins update site-media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins delete site-media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins upload site-documents" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-documents' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins update site-documents" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-documents' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins delete site-documents" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-documents' AND public.is_admin(auth.uid()));

-- Seed site settings with cooperative identity
INSERT INTO public.site_settings (key, value) VALUES
  ('identity', '{"name":"PICDECOS","full_name":"Pinyin Clan Development Cooperative Society Limited","motto":"From the Soil We Grow","registration":"24/025/CMR/NW/3B/203/CCA/002003/002003000"}'::jsonb),
  ('vision', '{"text":"To become a leading agro-pastoral cooperative across Mezam Division, and a model for community-driven development across Africa."}'::jsonb),
  ('mission', '{"text":"To offer employment to the Pinyin clan and deliver high-quality agro-pastoral products and services at affordable prices, managed by the community itself."}'::jsonb),
  ('contact', '{"email":"piedecos2024@gmail.com","website":"www.picdecos.org","postal":"P.O. Box 714, Bamenda","address":"Pinyin, Santa Sub Division, Mezam Division, North West Region, Cameroon","phones":[{"label":"Cameroon","number":"+237 670 769 326"},{"label":"Cameroon","number":"+237 676 250 729"},{"label":"USA","number":"+1 (484) 682-2800"},{"label":"UAE","number":"+971 329 287 736"}]}'::jsonb)
ON CONFLICT (key) DO NOTHING;
