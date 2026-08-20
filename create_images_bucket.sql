-- Insert the required buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('combo-banners', 'combo-banners', true),
  ('hero-banners', 'hero-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public read access for anyone to see the images
CREATE POLICY "Public read access for product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public read access for combo-banners" ON storage.objects FOR SELECT USING (bucket_id = 'combo-banners');
CREATE POLICY "Public read access for hero-banners" ON storage.objects FOR SELECT USING (bucket_id = 'hero-banners');

-- Allow all users to insert/upload images (since this is likely a simple admin setup)
CREATE POLICY "Allow public uploads to product-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Allow public uploads to combo-banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'combo-banners');
CREATE POLICY "Allow public uploads to hero-banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-banners');

-- Allow all users to update images
CREATE POLICY "Allow public updates to product-images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Allow public updates to combo-banners" ON storage.objects FOR UPDATE USING (bucket_id = 'combo-banners');
CREATE POLICY "Allow public updates to hero-banners" ON storage.objects FOR UPDATE USING (bucket_id = 'hero-banners');

-- Allow all users to delete images
CREATE POLICY "Allow public deletes to product-images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
CREATE POLICY "Allow public deletes to combo-banners" ON storage.objects FOR DELETE USING (bucket_id = 'combo-banners');
CREATE POLICY "Allow public deletes to hero-banners" ON storage.objects FOR DELETE USING (bucket_id = 'hero-banners');
