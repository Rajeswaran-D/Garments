-- Insert the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public read access for anyone to see the images
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow all users to insert/upload images (since this is likely a simple admin setup)
CREATE POLICY "Allow public uploads to images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow all users to update images
CREATE POLICY "Allow public updates to images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Allow all users to delete images
CREATE POLICY "Allow public deletes to images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
