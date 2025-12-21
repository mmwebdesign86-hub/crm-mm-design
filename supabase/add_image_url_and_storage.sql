-- 1. Add image_url column to clients table
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Create the Storage Bucket 'clients-logos'
-- Note: 'public' buckets are accessible without an auth token for reading.
INSERT INTO storage.buckets (id, name, public)
VALUES ('clients-logos', 'clients-logos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Security Policies for Storage
-- Enable RLS on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access (Anyone can see the logos)
CREATE POLICY "Public Access for Client Logos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'clients-logos' );

-- Allow Authenticated Uploads (Only logged in users can upload)
CREATE POLICY "Authenticated Users can upload Logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'clients-logos'
);

-- Allow Authenticated Updates/Deletes (If you want them to be able to replace/delete)
CREATE POLICY "Authenticated Users can update Logos"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'clients-logos' );

CREATE POLICY "Authenticated Users can delete Logos"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'clients-logos' );
