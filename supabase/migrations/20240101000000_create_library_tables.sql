-- Create library_materials table
CREATE TABLE IF NOT EXISTS library_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  file_size TEXT NOT NULL,
  pages INTEGER NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  download_url TEXT NOT NULL,
  cover_image_url TEXT,
  download_count INTEGER DEFAULT 0
);

-- Create user_downloads table to track downloads
CREATE TABLE IF NOT EXISTS user_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES library_materials(id) ON DELETE CASCADE,
  download_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_downloads_user_id ON user_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_downloads_material_id ON user_downloads(material_id);
CREATE INDEX IF NOT EXISTS idx_library_materials_type ON library_materials(type);
CREATE INDEX IF NOT EXISTS idx_library_materials_category ON library_materials(category);

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(material_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE library_materials
  SET download_count = download_count + 1
  WHERE id = material_id;
END;
$$ LANGUAGE plpgsql;

-- Create storage buckets for library files and cover images
INSERT INTO storage.buckets (id, name, public) VALUES ('library', 'library', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true) ON CONFLICT DO NOTHING;

-- Set up storage policies
CREATE POLICY "Library files are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'library');

CREATE POLICY "Cover images are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload library files" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'library' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload cover images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

-- RLS policies for library_materials
ALTER TABLE library_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Library materials are viewable by everyone"
  ON library_materials FOR SELECT
  USING (true);

CREATE POLICY "Library materials can be inserted by authenticated users"
  ON library_materials FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Library materials can be updated by authenticated users"
  ON library_materials FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Library materials can be deleted by authenticated users"
  ON library_materials FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS policies for user_downloads
ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own downloads"
  ON user_downloads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own downloads"
  ON user_downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);
